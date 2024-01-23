const userName = document.querySelector("#userName");
const userPass = document.querySelector("#userPass");
const form = document.querySelector("form");
const loadingCont = document.querySelector("#loadingCont");

function setKeyCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function postData(api, userName, userPass) {
  loadingCont.classList.add("active");
  let keyRes = await await fetch(api, {
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
  console.log(keyJon.token);
  console.log(keyRes.ok);
  if (keyRes.ok) {
    setKeyCookie("key", keyJon.token, 10);
    let a = document.createElement("a");
    a.href = "./index.html";
    a.click();
    a.remove();
  } else {
    alert("error");
  }
  loadingCont.classList.remove("active");
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  postData(
    `https://api.kotah.sbs/admin/login`,
    userName.value.trim(),
    userPass.value.trim()
  );
});
