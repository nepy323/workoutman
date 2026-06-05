import React, { useState, useEffect } from "react";

const INITIAL_MASTER = [
  { name: "胸推", loads: ["5片", "6片", "7片", "8片"], type: "normal" },
  { name: "肩推", loads: ["5片", "5片", "6片", "6片"], type: "normal" },
  { name: "下拉", loads: ["5片", "6片", "7片", "8片"], type: "normal" },
  { name: "腿推", loads: ["90kg", "100kg", "120kg", "140kg"], type: "normal" },
  { name: "抬腿", loads: ["50kg", "50kg", "60kg", "60kg"], type: "normal" },
  { name: "划船", loads: ["5片", "6片", "7片", "8片"], type: "normal" },
  { name: "二頭彎舉", loads: ["5片", "5片", "6片", "6片"], type: "normal" },
  { name: "引體向上", loads: ["10下", "10下", "10下"], type: "fixed" },
  { name: "快走", loads: ["10% 4.5KM 10分鐘"], type: "special" },
];

const MESSAGES = [
  "肌肉增長中！",
  "又進步了一點，雖然鏡子可能看不出來",
  "這汗水，是脂肪的眼淚",
  "痠痛感是成長的訊號！",
  "今天也是沒被器材壓死的一天",
  "袖口要爆了！",
  "戰鬥民族的訓練！",
  "燃燒吧！",
];

export default function App() {
  const [stage, setStage] = useState("MENU");
  const [masterList, setMasterList] = useState(INITIAL_MASTER);
  const [selectedPool, setSelectedPool] = useState([]);
  const [queue, setQueue] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    let interval = null;
    if (stage === "TRAIN")
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const toggleItem = (ex) => {
    setSelectedPool((prev) =>
      prev.find((i) => i.name === ex.name)
        ? prev.filter((i) => i.name !== ex.name)
        : [...prev, { ...ex }]
    );
  };

  const startWorkout = (level) => {
    if (selectedPool.length === 0) {
      alert("戰情室空空如也！請先勾選項目。");
      return;
    }
    const walk = selectedPool.find((i) => i.name === "快走");
    const others = selectedPool
      .filter((i) => i.name !== "快走")
      .sort(() => Math.random() - 0.5);
    const finalQueue = walk ? [...others, walk] : others;

    const processed = finalQueue.map((ex) => {
      let loads = [...ex.loads];
      if (ex.type === "normal") {
        if (level === "爽暴練")
          loads = loads.map((l) => l.replace(/(\d+)/, (m) => parseInt(m) + 2));
        if (level === "小小練") loads = loads.slice(0, 2);
      }
      return { ...ex, loads, currentIndex: 0 };
    });
    setQueue(processed);
    setSeconds(0);
    setStage("TRAIN");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <style>{`
        @keyframes flame { 0%, 100% { box-shadow: 0 0 20px #dc2626; border-color: #ef4444; } 50% { box-shadow: 0 0 40px #f59e0b; border-color: #f59e0b; } }
        .fire-card { animation: flame 1.5s infinite alternate; }
      `}</style>

      {stage === "MENU" && (
        <div className="max-w-xs mx-auto space-y-6">
          <h1 className="text-3xl font-black text-red-600 italic text-center w-full">
            今天練什麼
          </h1>
          <div className="grid grid-cols-2 gap-2">
            {masterList.map((ex) => (
              <div
                key={ex.name}
                className={`border-2 p-3 rounded-2xl cursor-pointer ${
                  selectedPool.find((i) => i.name === ex.name)
                    ? "border-red-500 bg-red-900"
                    : "border-gray-800"
                }`}
              >
                <div onClick={() => toggleItem(ex)}>{ex.name}</div>
                {selectedPool.find((i) => i.name === ex.name) && (
                  <button
                    className="text-[10px] text-yellow-400 mt-1"
                    onClick={() =>
                      setEditItem(selectedPool.find((i) => i.name === ex.name))
                    }
                  >
                    [微調組數/重量]
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const name = prompt("動作名稱?");
              if (name)
                setMasterList([
                  ...masterList,
                  { name, loads: ["5片"], type: "normal" },
                ]);
            }}
            className="w-full border border-dashed py-3 rounded-2xl"
          >
            + 新增動作
          </button>
          <div className="grid grid-cols-3 gap-2">
            {["小小練", "練一下", "爽暴練"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startWorkout(lvl)}
                className="py-4 bg-red-700 font-black rounded-2xl"
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 p-6 rounded-3xl border-2 border-red-600 w-full max-w-sm">
            <h2 className="mb-4 font-black text-center">
              {editItem.name} 配置
            </h2>
            <div className="space-y-2 mb-4">
              {editItem.loads.map((load, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 bg-black p-2 text-white border rounded-xl"
                    value={load}
                    onChange={(e) => {
                      const n = [...editItem.loads];
                      n[idx] = e.target.value;
                      setEditItem({ ...editItem, loads: n });
                    }}
                  />
                  <button
                    className="text-red-500 px-2"
                    onClick={() =>
                      setEditItem({
                        ...editItem,
                        loads: editItem.loads.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setEditItem({ ...editItem, loads: [...editItem.loads, "5片"] })
              }
              className="w-full mb-2 py-1 border border-dashed rounded-xl text-xs"
            >
              + 新增一組
            </button>
            <button
              onClick={() => {
                setSelectedPool((prev) =>
                  prev.map((i) => (i.name === editItem.name ? editItem : i))
                );
                setEditItem(null);
              }}
              className="w-full mt-2 bg-red-600 py-3 rounded-2xl font-black"
            >
              儲存配置
            </button>
          </div>
        </div>
      )}

      {stage === "TRAIN" && queue.length > 0 && (
        <div className="max-w-sm mx-auto space-y-6">
          <div className="flex justify-between bg-gray-900 p-4 border border-gray-800 rounded-2xl text-xs">
            <span>緊接著是: {queue[1]?.name || "FINISH"}</span>
            <span className="text-red-500 font-bold">
              訓練時間: {Math.floor(seconds / 60)}:
              {String(seconds % 60).padStart(2, "0")}
            </span>
          </div>
          <div className="bg-black p-8 border-4 fire-card rounded-3xl">
            <div className="text-4xl font-black mb-6">{queue[0].name}</div>
            <div className="space-y-3 mb-8">
              {queue[0].loads.map((load, i) => (
                <div
                  key={i}
                  className={
                    i === queue[0].currentIndex
                      ? "text-yellow-400 font-bold text-2xl border-l-4 border-yellow-400 pl-2"
                      : "text-gray-600"
                  }
                >
                  {load} {i === queue[0].currentIndex ? "◀" : ""}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (queue[0].currentIndex === queue[0].loads.length - 1) {
                  if (queue.length === 1) setStage("FINISH");
                  else setQueue((prev) => prev.slice(1));
                } else
                  setQueue((prev) => [
                    { ...prev[0], currentIndex: prev[0].currentIndex + 1 },
                    ...prev.slice(1),
                  ]);
              }}
              className="w-full bg-red-600 py-4 font-black rounded-2xl"
            >
              我做完啦!
            </button>
          </div>
        </div>
      )}

      {stage === "FINISH" && (
        <div className="max-w-sm mx-auto bg-gray-900 p-8 text-center border-2 border-red-500 rounded-3xl mt-10">
          <h2 className="text-3xl font-black text-green-500 mb-4 italic">
            可以回家啦!
          </h2>
          <p className="text-lg text-yellow-400 mb-6">
            {MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}
          </p>
          <div className="text-xl text-gray-400 mb-2">總訓練時間</div>
          <div className="text-4xl font-bold mb-8 text-white">{seconds} 秒</div>
          <button
            onClick={() => {
              setStage("MENU");
              setSelectedPool([]);
              setQueue([]);
            }}
            className="w-full bg-white text-black py-4 font-black rounded-2xl"
          >
            重啟戰場
          </button>
        </div>
      )}
    </div>
  );
}
