const BASE_URL = "http://127.0.0.1:7010";
let USERNAME = "邓";

const form = document.querySelector("form");
const textarea = document.querySelector("textarea");

// 清空之前的聊天记录
fetch(BASE_URL + "/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ clear: true }),
});

// 监控form表单的提交,textarea不能监听回车事件.
textarea.onkeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    // 出发表单提交
    form.dispatchEvent(new Event("submit"));
  }
};

let isLoading = false; // 是否目前正在发送请求
form.onsubmit = async (e) => {
  e.preventDefault();
  if (isLoading) {
    return;
  }
  isLoading = true;
  const content = textarea.value;
  createUserContent(USERNAME);
  const robot = createRobotContent();

  // 发送请求
  const resp = await fetch(BASE_URL + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  const reader = resp.body.getReader();
  const decoder = new TextDecoder("utf-8");
  while (1) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const text = decoder.decode(value);
    robot.append(text);
  }
  robot.over();
  isLoading = false;
};
