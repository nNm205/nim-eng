import sqlite3

DB_PATH = "database/db.sqlite"

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