import sqlite3
import os 
from dotenv import load_dotenv

DB_PATH = os.getenv("DB_PATH")

def save_interaction(user_id, user_input, response):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO learning_history (user_id, input, response)
    VALUES (?, ?, ?)
    """, (user_id, user_input, response))

    conn.commit()
    conn.close()

def get_recent_history(user_id, limit=5):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT input, response FROM learning_history
    WHERE user_id=?
    ORDER BY timestamp DESC
    LIMIT ?
    """, (user_id, limit))

    data = cursor.fetchall()
    conn.close()

    return data 

def save_mistake(user_id, mistake_type, example):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO mistakes (user_id, mistake_type, example)
    VALUES (?, ?, ?)
    """, (user_id, mistake_type, example))

    conn.commit()
    conn.close()

def get_weakness(user_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    SELECT mistake_type, COUNT(*) as cnt
    FROM mistakes 
    WHERE user_id=?
    GROUP BY mistake_type 
    ORDER BY cnt DESC
    LIMIT 1     
    """, (user_id,))

    result = cursor.fetchone()
    conn.close()

    return result[0] if result else None 