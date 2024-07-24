import os
import re
import json
from bs4 import BeautifulSoup

# HTMLファイルが存在するディレクトリのパスを設定
html_directory = 'html'
# JSONファイルを保存するディレクトリのパスを設定
json_directory = 'public'

# ディレクトリ内のすべてのファイルを取得
html_files = [f for f in os.listdir(html_directory) if f.endswith('.html')]

# 全ての時間割情報を保存するリスト
all_timetable_data = []

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

            # 授業科目名を抽出
            lecture_td = soup.find('td', string="授業科目名")
            if lecture_td:
                lecture_name_td = lecture_td.find_next_sibling('td')
                if lecture_name_td:

                    # <div> 要素を取得
                    div_element = lecture_name_td.find('div')

                    print(div_element)

                    if div_element:
                        div_text = div_element.get_text(separator='\n', strip=True)
                        parts = div_text.split('\n')
                        print(parts)
                     
                        # 最初の部分を取得（日本語）
                        if parts:
                            first_part = parts[0]

                            timetable_data["講義名"] = first_part

                        else:
                            print("テキストの最初の部分が見つかりませんでした。")
                    else:
                        print("<div> 要素が見つかりませんでした。")
            
            # HTMLファイル名も追加
            timetable_data["ファイル名"] = html_file
            
            # 全ての時間割情報リストに追加
            all_timetable_data.append(timetable_data)
            break

# 抽出した情報を表示（または他の処理に利用）
for timetable in all_timetable_data:
    print(timetable)

# 抽出した情報を一つのJSONファイルに保存
json_file_path = os.path.join(json_directory, 'all_timetable_data.json')
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(all_timetable_data, json_file, ensure_ascii=False, indent=4)
print(f"全ての時間割情報が{json_file_path}に保存されました。")
