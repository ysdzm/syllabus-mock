import os
import requests

def save_html(url, save_path):
    # ディレクトリが存在しない場合は作成する
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    try:
        # URLからHTMLデータを取得
        response = requests.get(url)
        response.raise_for_status()  # リクエストが成功したか確認する
        
        # HTMLデータをファイルに保存
        with open(save_path, 'w', encoding='utf-8') as file:
            file.write(response.text)
        
        print(f"HTMLデータを {save_path} に保存しました。")
    
    except requests.RequestException as e:
        print(f"HTMLデータの取得中にエラーが発生しました: {e}")

def download_html_for_range(start_id, end_id):
    for id in range(start_id, end_id + 1):
        if id % 2 == 0:  # 偶数の場合のみ
            url = f"https://syllabus.ict.nitech.ac.jp/view.php?id={id}"
            file_path = f"./html/{id}.html"
            save_html(url, file_path)

if __name__ == "__main__":
    # IDの範囲を設定する
    start_id = 79952
    end_id = 81254
    
    # HTMLデータを指定された範囲内のIDで保存する
    download_html_for_range(start_id, end_id)
