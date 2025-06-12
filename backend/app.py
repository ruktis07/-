from flask import Flask, request
from flask_cors import CORS
from db_config import get_oracle_connection

app = Flask(__name__)
CORS(app)

@app.route('/api/search',methods=['POST'])
#検索ボタン処理
def main():
    data=request.get_json()
    if data['mode']=='existing':
        item_cd=data['itemCode']    #品目コード
        where_query=f"WHERE m040m.ITEM_DIV = 'A' AND m040m.ITEM_CD = '{item_cd}'"
        result=db_search(where_query)
        main_box={"x":result[0][2],"y":result[0][3],"z":result[0][4]}
    elif data['mode']=='new':
        main_box={"x":data['sizeLength'],"y":data['sizeWidth'],"z":data['sizeHeight']}
    where_query="WHERE m040m.ITEM_NAME1 LIKE '%外箱%' AND (m040m.SIZE1 !=0 AND m040m.SIZE2 !=0 AND m040m.SIZE3 !=0)"
    list=db_search(where_query)
    result=[]
    item_search(main_box,list,result)
    return result

#データベースから品目情報取得
def db_search(where_query):
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
{where_query}
"""
    cursor.execute(query)
    result=cursor.fetchall()
    return result

def item_search(box,list,result):
    for item in list:
        sx=int(box["x"])
        sy=int(box["y"])
        sz=int(box["z"])
        lx=item[2]
        ly=item[3]
        lz=item[4]
        quantity=int(lx/sx)*int(ly/sy)*int(lz/sz)
        if quantity!=0:
            data={'category': item[0], 'itemCode': item[1],'gapLength': lx%sx, 'gapWidth': ly%sy, 'gapHeight': lz%sz ,'expectedQuantity': quantity}
            result.append(data)
    print(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
