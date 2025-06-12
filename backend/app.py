from flask import Flask, request, request
from flask_cors import CORS
from db_config import get_oracle_connection
from db_config import get_oracle_connection

app = Flask(__name__)
CORS(app)

@app.route('/api/search',methods=['POST'])
def search():
    data=request.get_json()
    if data['mode']=='existing':
        item_cd=data['itemCode']    #品目コード
        #データベースから品目情報取得
        connection=get_oracle_connection()
        cursor=connection.cursor() 
        query=f"""
            SELECT 
                m040m.ITEM_CD ,
                m040m.ITEM_NAME1 ,
                m040m.SIZE1 ,
                m040m.SIZE2 ,
                m040m.SIZE3 
            FROM DFW_M040M m040m 
            WHERE m040m.ITEM_DIV = 'A' AND m040m.ITEM_CD = '{item_cd}'
        """
        cursor.execute(query)
        result=cursor.fetchall()
        data['itemName']=result[0][1]
        data['gapLength']=result[0][2]
        data['gapWidth']=result[0][3]
        data['gapHeight']=result[0][4]
        print(result)
    elif data['mode']=='new':
        data['gapHeight']=70
    return [data,data,data]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
