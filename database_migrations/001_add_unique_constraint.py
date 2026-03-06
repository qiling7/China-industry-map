import sqlite3

def execute_system_upgrade():
    conn = sqlite3.connect('industry.db')
    cursor = conn.cursor()
    
    cursor.execute('ALTER TABLE industries RENAME TO industries_legacy')
    
    cursor.execute('''
        CREATE TABLE industries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT,
            industry_name TEXT,
            category TEXT,
            note TEXT,
            lat REAL,
            lng REAL,
            UNIQUE(region, industry_name)
        )
    ''')
    
    cursor.execute('''
        INSERT INTO industries (region, industry_name, category, note, lat, lng)
        SELECT region, industry_name, category, note, lat, lng 
        FROM industries_legacy
    ''')
    
    cursor.execute('DROP TABLE industries_legacy')
    
    conn.commit()
    conn.close()

execute_system_upgrade()