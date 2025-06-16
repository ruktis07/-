from flask import Flask, request, request
from flask_cors import CORS
from db_config import get_oracle_connection
from db_config import get_oracle_connection

app = Flask(__name__)
CORS(app)

@app.route('/api/search',methods=['POST'])
#検索ボタン処理
def main():
    data=request.get_json()
    gap={"x":int(data["gapLength"]),"y":int(data["gapWidth"]),"z":int(data["gapHeight"])}
    if data['mode']=='existing':
        item_cd=data['itemCode']    #品目コード
        where_query=f"WHERE m040m.ITEM_DIV = 'A' AND m040m.ITEM_CD = '{item_cd}'"
        result=db_search(where_query)
        if result==[]:
            x=0
            y=0
            z=0
        else:
            x=result[0][2]
            y=result[0][3]
            z=result[0][4]
    elif data['mode']=='new':
        x=int(data['sizeLength'])
        y=int(data['sizeWidth'])
        z=int(data['sizeHeight'])
    where_query="WHERE m040m.ITEM_NAME1 LIKE '%外箱%' AND (m040m.SIZE1 !=0 AND m040m.SIZE2 !=0 AND m040m.SIZE3 !=0)"
    list=db_search(where_query)
    result=[]
    if x==0 and y==0 and z==0:
        data={"error":"この品目コードは箱ではないか、サイズが登録がされていません。"}
        result.append(data)
    else:
        item_search(x,y,z,list,result,gap,orientation='縦入れ')
        item_search(y,x,z,list,result,gap,orientation='横入れ')
        result=sort_by_gap_sum(result)
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

def item_search(sx,sy,sz,list,result,gap,orientation):
    for item in list:
        lx=item[2]
        ly=item[3]
        lz=item[4]
        gapx=int(lx%sx)
        gapy=int(ly%sy)
        gapz=int(lz%sz)
        quantity=int(lx/sx)*int(ly/sy)*int(lz/sz)
        if quantity!=0 and gapx<=gap["x"] and gapy<=gap["y"] and gapz<=gap["z"]:
            quantity=f"{int(lx/sx)} 箱 × {int(ly/sy)} 箱 × {int(lz/sz)} 段"
            data={
                'itemCode': item[0],
                'itemName': item[1],
                'expectedQuantity': quantity,
                'gapLength': gapx,
                'gapWidth': gapy, 
                'gapHeight': gapz,
                'orientation': orientation,
                'outerLength': lx,
                'outerWidth': ly,
                'outerHeight': lz
            }
            result.append(data)

#隙間の合計の小さい順にソート
def sort_by_gap_sum(data):
    return sorted(
        data,
        key=lambda x: x['gapLength'] + x['gapWidth'] + x['gapHeight']
    )
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
