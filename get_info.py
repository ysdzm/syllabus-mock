import os
import re
from bs4 import BeautifulSoup

# HTMLファイルが存在するディレクトリのパスを設定
html_directory = 'html'

# ディレクトリ内のすべてのファイルを取得
html_files = [f for f in os.listdir(html_directory) if f.endswith('.html')]

for html_file in html_files:
    # HTMLファイルのパスを設定
    html_file_path = os.path.join(html_directory, html_file)
    
    # HTMLファイルを読み込む
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # BeautifulSoupでHTMLを解析
    soup = BeautifulSoup(html_content, 'html.parser')

    # 時間割部分の情報を抽出
    timetable_data = {}
    timetable_info = soup.find_all('td', bgcolor="lightsteelblue")

    for info in timetable_info:
        text = info.get_text(strip=True)
        if text == "時間割":  # 正確に "時間割" と一致するセルを探す
            timetable_td = info.find_next_sibling('td')
            timetable_text = timetable_td.get_text(strip=True)
            
            # 正規表現を使用してクォーター、曜日、時間を抽出
            # Unicodeの全角数字を含む正規表現
            match = re.search(r"第(\d)クォーター\s*(\w)曜(\d+-\d+)限", timetable_text)
            if match:
                quarter = match.group(1)
                day = match.group(2)
                time = match.group(3)
                timetable_data = {
                    "クォーター": quarter,
                    "曜日": day,
                    "時間": time
                }
            break

    # 抽出した情報を表示（または他の処理に利用）
    print(f"HTMLファイル: {html_file}")
    print("時間割情報:", timetable_data)
    print()

    # 必要に応じてJSONに保存する処理を追加
    # json_file_name = os.path.splitext(html_file)[0] + '.json'
    # json_file_path = os.path.join(html_directory, json_file_name)
    # with open(json_file_path, 'w', encoding='utf-8') as json_file:
    #     json.dump(timetable_data, json_file, ensure_ascii=False, indent=4)
    # print(f"時間割情報が{json_file_path}に保存されました。")
