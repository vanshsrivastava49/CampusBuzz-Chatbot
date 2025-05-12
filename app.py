from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai

load_dotenv()
app = Flask(__name__)
CORS(app)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URI)   
db = mongo_client["CampusBuzz"]
clubs_collection = db["clubs"]
queries_collection = db["queries"]

def get_all_clubs():
    return [f"{club['club_name']}: {club['description']}" for club in clubs_collection.find()]

def get_all_queries():
    return [f"{q['question']}:{q['keywords']}: {q['answer']}" for q in queries_collection.find()]

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    query = data.get("message", "")

    if not query:
        return jsonify({"response": "No message received."})

    club_context = get_all_clubs()
    faq_context = get_all_queries()

    if not club_context and not faq_context:
        return jsonify({"response": "No data found in the system."})
    context = f"""CLUB INFORMATION:\n{chr(10).join(club_context)}\n\nFREQUENTLY ASKED QUESTIONS:\n{chr(10).join(faq_context)}"""
    prompt = f"""
You are a helpful campus assistant chatbot named CampusBuzz. Use the provided context to answer the user's query in a clear and concise way.
{context}
User Query: {query}

Do not repeat the user question. Only respond with the helpful information from context.
"""
    try:
        response = llm.invoke(prompt)
        return jsonify({"response": response.content if hasattr(response, "content") else str(response)})
    except Exception as e:
        return jsonify({"response": f"Error: {e}"}), 500
if __name__ == '__main__':
    app.run(debug=True)