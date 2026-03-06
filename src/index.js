import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newMainCategory, setNewMainCategory] = useState("小説");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("全て");
  const [selectedSubCategory, setSelectedSubCategory] = useState("全て");
  const [editingBook, setEditingBook] = useState(null);

  const categoryStructure = {
    小説: [
      "ファンタジー",
      "ミステリー",
      "恋愛",
      "SF",
      "歴史",
      "ホラー",
      "純文学",
      "その他",
    ],
    技術書: [
      "プログラミング",
      "データベース",
      "AI・機械学習",
      "ネットワーク",
      "セキュリティ",
      "Web開発",
      "その他",
    ],
    ビジネス書: [
      "経営",
      "マーケティング",
      "自己啓発",
      "投資・金融",
      "起業",
      "リーダーシップ",
      "その他",
    ],
    "趣味・実用": [
      "料理",
      "健康",
      "スポーツ",
      "旅行",
      "アート",
      "音楽",
      "ガーデニング",
      "その他",
    ],
    学術書: [
      "歴史",
      "哲学",
      "心理学",
      "社会学",
      "経済学",
      "理学",
      "工学",
      "その他",
    ],
    その他: ["エッセイ", "自伝", "図鑑", "辞書", "雑誌", "漫画", "その他"],
  };

  const mainCategories = Object.keys(categoryStructure);

  useEffect(() => {
    if (newMainCategory && categoryStructure[newMainCategory]) {
      setNewSubCategory(categoryStructure[newMainCategory][0]);
    }
  }, [newMainCategory]);

  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (newTitle.trim()) {
      setBooks([
        ...books,
        {
          id: Date.now(),
          title: newTitle,
          author: newAuthor || "不明",
          mainCategory: newMainCategory,
          subCategory: newSubCategory,
          addedDate: new Date().toLocaleDateString("ja-JP"),
        },
      ]);
      setNewTitle("");
      setNewAuthor("");
    }
  };

  const startEdit = (book) => {
    setEditingBook({ ...book });
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  const saveEdit = () => {
    setBooks(
      books.map((book) => (book.id === editingBook.id ? editingBook : book))
    );
    setEditingBook(null);
  };

  const deleteBook = (id) => {
    if (window.confirm("この本を削除しますか？")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const exportToCSV = () => {
    const sortedBooks = [...books].sort((a, b) =>
      a.title.localeCompare(b.title, "ja")
    );

    const headers = ["タイトル", "著者", "大カテゴリ", "小カテゴリ", "登録日"];
    const csvContent = [
      headers.join(","),
      ...sortedBooks.map((book) =>
        [
          book.title,
          book.author,
          book.mainCategory,
          book.subCategory,
          book.addedDate,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `蔵書リスト_${new Date()
      .toLocaleDateString("ja-JP")
      .replace(/\//g, "")}.csv`;
    link.click();
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMainCategory =
      selectedMainCategory === "全て" ||
      book.mainCategory === selectedMainCategory;
    const matchesSubCategory =
      selectedSubCategory === "全て" ||
      book.subCategory === selectedSubCategory;
    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  const mainCategoryStats = mainCategories.reduce((stats, category) => {
    stats[category] = books.filter(
      (book) => book.mainCategory === category
    ).length;
    return stats;
  }, {});

  const getSubCategoryStats = (mainCat) => {
    return (
      categoryStructure[mainCat]?.reduce((stats, subCat) => {
        stats[subCat] = books.filter(
          (book) => book.mainCategory === mainCat && book.subCategory === subCat
        ).length;
        return stats;
      }, {}) || {}
    );
  };

  const inputStyle = {
    padding: "8px",
    margin: "5px",
    backgroundColor: "#333",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
  };

  const buttonStyle = {
    padding: "8px 16px",
    margin: "5px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>📚 蔵書検索システム</h1>
        <p>
          現在 <strong>{books.length}</strong> 冊の本が登録されています
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "15px",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        <h3>📊 カテゴリ別統計</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          {mainCategories.map((mainCat) => (
            <div
              key={mainCat}
              style={{
                backgroundColor: "#333",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#4a90e2",
                }}
              >
                {mainCat}: {mainCategoryStats[mainCat]}冊
              </div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                {Object.entries(getSubCategoryStats(mainCat))
                  .filter(([_, count]) => count > 0)
                  .map(([subCat, count]) => (
                    <div key={subCat}>
                      • {subCat}: {count}冊
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        <h3>📝 新しい本を登録</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#ccc",
                marginBottom: "4px",
              }}
            >
              タイトル *
            </label>
            <input
              type="text"
              placeholder="本のタイトル"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#ccc",
                marginBottom: "4px",
              }}
            >
              著者
            </label>
            <input
              type="text"
              placeholder="著者名"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#ccc",
                marginBottom: "4px",
              }}
            >
              大カテゴリ
            </label>
            <select
              value={newMainCategory}
              onChange={(e) => setNewMainCategory(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              {mainCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#ccc",
                marginBottom: "4px",
              }}
            >
              小カテゴリ
            </label>
            <select
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              {categoryStructure[newMainCategory]?.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
          <button onClick={addBook} style={{ ...buttonStyle, width: "100%" }}>
            ➕ 登録
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        <h3>🔍 検索・フィルター</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="タイトル、著者で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />
          <select
            value={selectedMainCategory}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              setSelectedSubCategory("全て");
            }}
            style={{ ...inputStyle, width: "100%" }}
          >
            <option value="全て">全大カテゴリ</option>
            {mainCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
            disabled={selectedMainCategory === "全て"}
          >
            <option value="全て">全小カテゴリ</option>
            {selectedMainCategory !== "全て" &&
              categoryStructure[selectedMainCategory]?.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
          </select>
          <button
            onClick={exportToCSV}
            style={{
              ...buttonStyle,
              backgroundColor: "#27ae60",
              width: "100%",
            }}
          >
            📥 CSV出力
          </button>
        </div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h3>📖 蔵書一覧 ({filteredBooks.length}冊)</h3>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            style={{
              backgroundColor: "#333",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
              border: "1px solid #555",
            }}
          >
            {editingBook && editingBook.id === book.id ? (
              // 編集モード
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#ccc",
                        marginBottom: "4px",
                      }}
                    >
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={editingBook.title}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          title: e.target.value,
                        })
                      }
                      style={{ ...inputStyle, width: "100%" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#ccc",
                        marginBottom: "4px",
                      }}
                    >
                      著者
                    </label>
                    <input
                      type="text"
                      value={editingBook.author}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          author: e.target.value,
                        })
                      }
                      style={{ ...inputStyle, width: "100%" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#ccc",
                        marginBottom: "4px",
                      }}
                    >
                      大カテゴリ
                    </label>
                    <select
                      value={editingBook.mainCategory}
                      onChange={(e) => {
                        const newMainCat = e.target.value;
                        setEditingBook({
                          ...editingBook,
                          mainCategory: newMainCat,
                          subCategory: categoryStructure[newMainCat][0],
                        });
                      }}
                      style={{ ...inputStyle, width: "100%" }}
                    >
                      {mainCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#ccc",
                        marginBottom: "4px",
                      }}
                    >
                      小カテゴリ
                    </label>
                    <select
                      value={editingBook.subCategory}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          subCategory: e.target.value,
                        })
                      }
                      style={{ ...inputStyle, width: "100%" }}
                    >
                      {categoryStructure[editingBook.mainCategory]?.map(
                        (subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={saveEdit}
                    style={{ ...buttonStyle, backgroundColor: "#27ae60" }}
                  >
                    ✓ 保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{ ...buttonStyle, backgroundColor: "#95a5a6" }}
                  >
                    ✕ キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // 表示モード
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#4a90e2" }}>
                    {book.title}
                  </h4>
                  <p style={{ margin: "4px 0", color: "#ccc" }}>
                    👤 {book.author}
                  </p>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#aaa",
                      marginTop: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#4a90e2",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    >
                      {book.mainCategory}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#6c757d",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                      }}
                    >
                      {book.subCategory}
                    </span>
                    <span>📅 {book.addedDate}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => startEdit(book)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#f39c12",
                      fontSize: "12px",
                      padding: "6px 12px",
                    }}
                  >
                    ✏️ 編集
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#e74c3c",
                      fontSize: "12px",
                      padding: "6px 12px",
                    }}
                  >
                    🗑️ 削除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredBooks.length === 0 &&
          (searchTerm ||
            selectedMainCategory !== "全て" ||
            selectedSubCategory !== "全て") && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                color: "#888",
              }}
            >
              <p>条件に一致する本が見つかりません</p>
              <p>検索条件を変更してみてください</p>
            </div>
          )}

        {books.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              color: "#888",
            }}
          >
            <h4>📚 最初の本を登録してみましょう！</h4>
            <p>上の入力フォームから本を追加できます</p>
          </div>
        )}
      </div>
    </div>
  );
}
