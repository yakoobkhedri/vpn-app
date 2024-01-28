const form = document.querySelector("form"),
  userName = document.querySelector("#userName"),
  userPass = document.querySelector("#userPass"),
  rememberMe = document.querySelector("#rememberMe"),
  submitBtn = document.querySelector("#submitBtn"),
  alertCont = document.querySelector("#alert");

let isLoginSuccess = false;

const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
const postData = async (api, userName, userPass) => {
  submitBtn.classList.add("submited");
  alertCont.classList.remove("danger");
  alertCont.classList.remove("warning");
  alertCont.children[0].textContent = "";
  let keyRes = await fetch(api, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName,
      password: userPass,
    }),
  });
  let keyJon = await keyRes.json();
  submitBtn.classList.remove("submited");
  if (keyRes.ok) {
    setCookie("key", keyJon.token, 10);
    isLoginSuccess = true;
    let a = document.createElement("a");
    a.href = "./index.html";

    a.click();
  } else {
    alertCont.classList.add("danger");
    alertCont.classList.remove("warning");
    alertCont.children[0].textContent = "نام و رمز عبور خود را چک کنید !!!";
  }
};
const isSetRemember = () => {
  if (!rememberMe.checked || !isLoginSuccess) return;
  let data = {
    userN: userName.value.trim(),
  };
  setCookie("rememeberMeSet", JSON.stringify(data), 10);
};

if (getCookie("rememeberMeSet")) {
  let data = JSON.parse(getCookie("rememeberMeSet"));
  userName.value = data.userN;
  rememberMe.checked = true;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!navigator.onLine) {
    alertCont.classList.add("warning");
    alertCont.classList.remove("danger");
    alertCont.children[0].textContent = "افلاین هستید !!!";
    return;
  } else if (submitBtn.classList.contains("submited")) return;
  postData(
    `https://api.kotah.sbs/admin/login`,
    userName.value.trim(),
    userPass.value.trim()
  );
  isSetRemember();
});
