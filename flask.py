from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).parent / 'books.db'


app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)


def init_db():
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, price REAL)''')
conn.commit(); conn.close()


@app.route('/')
def index():
return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/books', methods=['GET'])
def list_books():
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('SELECT id,title,author,price FROM books ORDER BY id DESC')
rows = c.fetchall()
conn.close()
return jsonify([{'id':r[0],'title':r[1],'author':r[2],'price':r[3]} for r in rows])


@app.route('/api/books', methods=['POST'])
def add_book():
data = request.get_json() or {}
title = data.get('title','').strip()
author = data.get('author','').strip()
price = float(data.get('price',0))
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('INSERT INTO books (title,author,price) VALUES (?,?,?)',(title,author,price))
conn.commit()
conn.close()
return jsonify({'ok':True}), 201


@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('DELETE FROM books WHERE id=?',(book_id,))
conn.commit(); conn.close()
return jsonify({'ok':True})


if __name__ == '__main__':
init_db()
app.run(debug=True, host='0.0.0.0', port=5000)
