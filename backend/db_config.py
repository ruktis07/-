# db_config.py (PostgreSQL + Oracle対応版)
import os
import oracledb
from dotenv import load_dotenv

load_dotenv()

# Oracle接続
def get_oracle_connection():
    try:
        dsn=f"{os.getenv('ORACLE_HOST')}:{os.getenv('ORACLE_PORT','1521')}/{os.getenv('ORACLE_SERVICE_NAME')}"
        return oracledb.connect(
            user=os.getenv('ORACLE_USER'),
            password=os.getenv('ORACLE_PASSWORD'),
            dsn=dsn
        )
    except oracledb.DatabaseError as e:
        print(f"Oracle接続エラー: {e}")
        raise