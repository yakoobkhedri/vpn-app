const main = () => {
  const dropdownBtn = Array.from(
      document.getElementsByClassName("dropdownBtn")
    ),
    dropdownContent = Array.from(
      document.getElementsByClassName("dropdownContent")
    ),
    dropdownItems = Array.from(
      document.querySelectorAll(".dropdownContent li")
    );

  const showUsers = document.getElementById("show-user"),
    showAvatar = document.getElementById("show-avatar"),
    mainHoverSvg = Array.from(
      document.getElementsByClassName("main-hover-svg")
    );

  const pagesUsersCont = document.querySelector("#pagesUsers");
  const usersContainer = document.querySelector("#usersContainer");
  const userCont = document.querySelector("#userCont"),
    searchUser = document.querySelector("#searchUser"),
    statusUserLink = document.querySelector("#statusUserLink"),
    QRCodeStatus = document.querySelector("#QRCodeStatus"),
    searchForm = document.querySelector("#formSearchBar"),
    searchIconBtn = document.querySelector("#searchIconBtn"),
    qrCodeImg = document.querySelector(".qrCodeImg"),
    qrCodeContainer = document.querySelector("#qrCodeContainer"),
    closeQrCodeCont = document.querySelector("#closeQrCodeCont");
  const addUserForm = document.querySelector("#addUserForm"),
    addUserEmail = document.querySelector("#addUserEmail"),
    addUserExpire = document.querySelector("#addUserExpire"),
    addUserSize = document.querySelector("#addUserSize"),
    addUserBtn = document.querySelector("#addUserBtn"),
    addUserPlus = document.querySelector("#addUserPlus"),
    addUserPcs = document.querySelector("#addUserPcs"),
    addUserMinus = document.querySelector("#addUserMinus"),
    alertContainer = addUserForm.querySelector("#alert"),
    addUserCloseDropDown = document.querySelector("#addUserCloseDropDown");

  const editUserForm = document.querySelector("#editUserForm"),
    editUserName = document.querySelector("#editUserName"),
    editUserVip = document.querySelector("#editUserVip"),
    editUserVipPlus = document.querySelector("#editUserVipPlus"),
    editUserDateExpire = document.querySelector("#editUserDateExpire"),
    editUserSizeContent = document.querySelector("#editUserSizeContent"),
    editUserSize = document.querySelectorAll("[data-editUserSize]"),
    editUserPcsMinus = document.querySelector("#editUserPcsMinus"),
    editUserPcsVal = document.querySelector("#editUserPcsVal"),
    editUserPcsPlus = document.querySelector("#editUserPcsPlus");
  const loadingCont = document.querySelector(".loadingCont");

  let users,
    indexTargetItem,
    userStatus,
    userLink,
    userLinkQRCode,
    usersItem,
    userEdit,
    disableAccount;
  let isTrueChecked = false;
  let clickedCont = 0;
  let isSetKey = false;
  let timeOut;
  let pageId = 1;
  let addAccount = {
    productId: "",
    amountProduct: "",
    expireDays: "",
    userName: "",
  };
  let vipType = 1;
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
  const number = new Intl.NumberFormat("en-US", { style: "decimal" }).format(
    987654321
  );
  const key = getCookie("key");
  if (key) isSetKey = true;
  const setValueAsGb = (index, usersList, isTraffic = false) => {
    let traffic;
    let used;
    if (isTraffic) {
      if (String(users.data[index].info.traffic).includes("TB")) {
        traffic =
          Number(users.data[index].info.traffic.replace("TB", "")) * 10 ** +3;
      } else if (String(users.data[index].info.traffic).includes("GB")) {
        traffic = Number(users.data[index].info.traffic.replace("GB", ""));
      } else if (String(users.data[index].info.traffic).includes("MB")) {
        traffic =
          Number(users.data[index].info.traffic.replace("MB", "")) * 10 ** -3;
      } else if (String(users.data[index].info.traffic).includes("KB")) {
        traffic =
          Number(users.data[index].info.traffic.replace("KB", "")) * 10 ** -6;
      }
      return traffic;
    }

    if (String(users.data[index].info.used).includes("TB")) {
      used = Number(users.data[index].info.used.replace("TB", "")) * 10 ** +3;
    } else if (String(users.data[index].info.used).includes("GB")) {
      used = Number(users.data[index].info.used.replace("GB", ""));
    } else if (String(users.data[index].info.used).includes("MB")) {
      used = Number(users.data[index].info.used.replace("MB", "")) * 10 ** -3;
    } else if (String(users.data[index].info.used).includes("KB")) {
      used = Number(users.data[index].info.used.replace("KB", "")) * 10 ** -6;
    }
    return used;
  };
  const searchFunc = async (e) => {
    e.preventDefault();
    clearEventListener();
    usersItem = document.querySelectorAll("[data-usersItem]");
    usersItem.forEach((item) => {
      item.remove();
    });
    userCont.classList.add("loadingShow");
    userCont.classList.remove("showEmpty");
    users = await fetch(
      `https://api.kotah.sbs/userAjax?page=${pageId}&q=${searchUser.value.trim()}`,
      {
        headers: {
          Authorization: "Bearer " + key,
        },
      }
    ).catch(() => {
      userCont.classList.add("alertShow");
      $("#userContAlert")[0].children[0].textContent =
        "دوباره تلاش کنید !! مشکل اتصال به سرور";
    });
    userCont.classList.remove("loadingShow");
    users = await users.json();
    setUser(users);
  };
  const statusFunc = (item, index) => {
    // to GB
    let used = setValueAsGb(index, users.data);
    let traffic = setValueAsGb(index, users.data, true);
    let usedTraf = Math.abs((used / traffic) * 100 - 100);
    $(
      ".progress-bar.value"
    )[0].style = `  background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
    conic-gradient(#0f64fd ${usedTraf}%, #f4f4f4 0)`;
    $("#userSize")[0].textContent = `${
      traffic ? (traffic - used).toFixed(2) : "نامشخص"
    }
    /
    ${traffic ? traffic + "گیگابایت " : "نامشخص"}  `;

    $("#userNameProduct")[0].textContent = users.data[index].email;
  };

  const userLinkHandFunc = (item, index, classs) => {
    navigator.clipboard.writeText(users.data[index].info.subLink);
    timeOut === undefined ? [] : clearTimeout(timeOut);
    if (item.classList.contains(classs)) return;
    item.classList.add(classs);
    setTimeout(() => {
      item.classList.remove(classs);
    }, 2000);
  };
  const showQrCode = (item, index, classs) => {
    qrCodeContainer.classList.add(classs);
    new QRCode(qrCodeImg, {
      text: users.data[index].info.subLink,
      width: 250,
      height: 250,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  };
  const userEditFun = (item, index) => {
    editUserName.value = users.data[index].email;
    editUserSizeContent.textContent = `${setValueAsGb(
      index,
      users.data,
      true
    )} گیگابایت`;
  };
  const disableAccountFun = async (item, index, e) => {
    clickedCont += 1;
    if (item.checked && clickedCont <= 1) {
      let enable = await (
        await fetch("https://api.kotah.sbs/user/enable", {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + key,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: users.data[index].email,
          }),
        })
      ).text();
      clickedCont = 0;
    } else if (!item.checked && clickedCont <= 1) {
      let disable = await (
        await fetch("https://api.kotah.sbs/user/disable", {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + key,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: users.data[index].email,
          }),
        })
      ).text();
      clickedCont = 0;
    }
  };
  const clearEventListener = () => {
    userStatus = document.querySelectorAll("[data-userStatus]");
    userLink = document.querySelectorAll("[data-userLink]");
    userLinkQRCode = document.querySelectorAll("[data-userLinkQRCode]");
    userEdit = document.querySelectorAll("[data-userEdit]");
    disableAccount = document.querySelectorAll("[data-disableAccount]");

    userStatus.forEach((item, index) => {
      item.removeEventListener("click", () => {
        statusFunc(item, index);
        indexTargetItem = index;
      });
    });
    userLink.forEach((item, index) => {
      item.removeEventListener("click", () => {
        userLinkHandFunc(item, index, "active");
        indexTargetItem = index;
      });
    });
    userLinkQRCode.forEach((item) => {
      item.removeEventListener("click", () => {
        showQrCode(item, index, "active");
        indexTargetItem = index;
      });
    });
    userEdit.forEach((item, index) => {
      item.removeEventListener("click", () => {
        userEditFun(item, index);
        indexTargetItem = index;
      });
    });
    disableAccount.forEach((item, index) => {
      item.removeEventListener("change", () => {
        disableAccountFun(item, index);
        indexTargetItem = index;
      });
    });
  };
  const createSizeAddUserPage = async () => {
    let listUserAmount = await fetch("https://api.kotah.sbs/product", {
      headers: {
        Authorization: "Bearer " + key,
      },
    }).catch(() => {
      userCont.classList.add("alertShow");
      $("#userContAlert")[0].children[0].textContent =
        "دوباره تلاش کنید !! مشکل اتصال به سرور";
    });
    listUserAmount = await listUserAmount.json();

    listUserAmount.forEach((item, index) => {
      let li = document.createElement("li");
      li.className = "py-3 cursor-pointer border-bottom";
      li.textContent = item.name;
      addUserSize.appendChild(li);
      li.addEventListener("click", () => {
        addAccount.productId = item.id;
        addAccount.amountProduct = item.size;
        dropdownContent.forEach((items) => {
          items.classList.remove("active");
        });
        dropdownBtn.forEach((items) => {
          items.querySelectorAll("svg:last-child").forEach((item) => {
            item.classList.remove("active");
          });
        });
        document.querySelector("#serviceSize").textContent = item.name;
      });
    });

    return listUserAmount;
  };
  const createAccountDate = async () => {
    let listUserDate = [
      { name: "30 روزه", day: 30 },
      { name: "60 روزه", day: 60 },
      { name: "90 روزه", day: 90 },
      { name: "120 روزه", day: 120 },
      { name: "365 روزه", day: 365 },
    ];

    listUserDate.forEach((item, index) => {
      let li = document.createElement("li");
      li.className = "py-3 cursor-pointer border-bottom";
      li.textContent = item.name;
      addUserExpire.appendChild(li);
      li.addEventListener("click", () => {
        addAccount.expireDays = item.day;
        dropdownContent.forEach((items) => {
          items.classList.remove("active");
        });
        dropdownBtn.forEach((items) => {
          items.querySelectorAll("svg:last-child").forEach((item) => {
            item.classList.remove("active");
          });
        });
        document.querySelector("#addUserDate").textContent = item.name;
      });
    });
    return listUserDate;
  };
  createAccountDate();
  createSizeAddUserPage();
  const setDate = (user) => {
    if (user.info.expire === "Unlimited") return false;
    let year = new Date(user.info.expire).getFullYear();
    let month = new Date(user.info.expire).getMonth() + 1;
    let day = new Date(user.info.expire).getDate();
    let toFaDateExpire = moment(`${year}/${month}/${day}`);
    toFaDateExpire.locale("fa");
    return toFaDateExpire;
  };
  const getAmountSizeAsGb = (x) => {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  };
  const addAccountFunc = async (data) => {
    userCont.classList.add("loadingShow");
    userCont.classList.remove("showEmpty");
    const usersItem = document.querySelectorAll("[data-usersitem]");
    usersItem.forEach((item) => {
      item.remove();
    });
    let addAccountApi = await fetch(
      `https://api.kotah.sbs/user/createAccounts`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + key,
          Accept: "*/*",
          "Content-type": "application/json ",
        },
        body: JSON.stringify({
          count: data.count,
          amount: data.amount,
          date: data.date,
          email: data.email,
          name: data.name,
          productId: data.productId,
          groupId: data.groupId,
        }),
      }
    );
    addUserCloseDropDown.click();
    addUserEmail.value = "";
    addUserDate.textContent = "مدت سرویس";
    serviceSize.textContent = "حجم سرویس";
    addUserPcs.value = 1;
    userVip.checked = true;
    getUser();
    addAccountApi = await addAccountApi.json();
    return addAccountApi;
  };
  window.addEventListener("dragover", (e) => {
    console.log(e);
  });
  const setAdminStatus = async () => {
    const adminName = document.querySelector("#adminName");
    const adminAmount = document.querySelector("#adminAmount");
    let adminStatus = await fetch(" https://api.kotah.sbs/admin/profile", {
      headers: {
        Authorization: "Bearer " + key,
      },
    }).catch(() => {});
    let admin = await adminStatus.json();
    if (adminStatus.ok) {
      adminName.textContent = admin.name;
      adminAmount.textContent =
        admin.amount !== "NaN"
          ? getAmountSizeAsGb(Number(admin.amount))
          : "نامشخص";
    } else {
      adminName.textContent = "مشکل در اتصال به سرور";
      adminAmount.textContent = "مشکل در اتصال به سرور";
    }
  };
  setAdminStatus();
  const setUser = async () => {
    userCont.classList.add("showEmpty");
    if (!isSetKey) return userCont.classList.add("unsetKeyShow");
    if (users.data == undefined || users.data == "") return;
    else userCont.classList.remove("showEmpty");
    users.data.forEach((user, index) => {
      let traffic = setValueAsGb(index, users.data, true);
      let used = setValueAsGb(index, users.data);
      let realTraffic = (Number(traffic) - Number(used)).toFixed(2);
      let email = user.email;
      usersContainer.innerHTML += ` 
  <div data-usersItem="usersItem" class="rounded-15 border overflow-hidden mb-3">
   <div class="d-flex align-items-center justify-content-between bg-gray p-3">
     <div class="d-flex align-items-center gap-1">
       <div class="form-check form-switch d-flex">
         <input class="form-check-input" data-disableAccount="disableAccount" type="checkbox" role="switch" ${
           user.info.status === "active" ? "checked" : ""
         }>
       </div>
       <label data-userStatus="userStatus" class="form-check-label cursor-pointer fs-14 fw-bold" data-bs-toggle="offcanvas" data-bs-target="#currentService" aria-controls="offcanvasBottom">${email}</label>
     </div>
     <a data-userEdit="userEdit" data-bs-toggle="offcanvas" data-bs-target="#editUser" aria-controls="offcanvasBottom">
       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
         <path
           d="M12.155 3.3L4.62916 11.2658C4.345 11.5683 4.07 12.1642 4.015 12.5767L3.67583 15.5467C3.55666 16.6192 4.32666 17.3525 5.39 17.1692L8.34166 16.665C8.75416 16.5917 9.33166 16.2892 9.61583 15.9775L17.1417 8.01166C18.4433 6.63666 19.03 5.06916 17.0042 3.15333C14.9875 1.25583 13.4567 1.925 12.155 3.3Z"
           stroke="#201F31" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
           stroke-linejoin="round" />
         <path d="M10.8992 4.62915C11.2933 7.15915 13.3467 9.09332 15.895 9.34998" stroke="#201F31"
           stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
         <path d="M2.75 20.1667H19.25" stroke="#201F31" stroke-width="1.5" stroke-miterlimit="10"
           stroke-linecap="round" stroke-linejoin="round" />
       </svg>
     </a>
   </div>
   <div class="bg-gray2 p-3">
     <div class="d-flex align-items-center gap-3 justify-content-between mb-3">
       <div class="d-flex align-items-center gap-3">
         <div class="h-44 w-44 rounded-circle d-flex align-items-center justify-content-center bg-gray border">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
             <path
               d="M13.74 9.00001C15.69 9.00001 16.5 8.25001 15.78 5.79001C15.2925 4.13251 13.8675 2.70751 12.21 2.22001C9.75 1.50001 9 2.31001 9 4.26001V6.42001C9 8.25001 9.75 9.00001 11.25 9.00001H13.74Z"
               stroke="#201F31" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
             <path
               d="M15 11.025C14.3025 14.4975 10.9725 17.0175 7.18501 16.4025C4.34251 15.945 2.05501 13.6575 1.59001 10.815C0.982509 7.04251 3.48751 3.71251 6.94501 3.00751"
               stroke="#201F31" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
           </svg>
         </div>
         <div class="text-dark position-relative z-10">
           <p class="fs-10 opacity-70 mb-1 text-secondary">حجم باقی مانده</p>
           <p class="fw-bold fs-14 mb-0">${
             realTraffic !== "NaN" ? realTraffic + " گیگ" : "نامشخص"
           }</p>
         </div>
       </div>
       <div class="d-flex align-items-center gap-3">
         <div class="h-44 w-44 rounded-circle d-flex align-items-center justify-content-center bg-gray border">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
             <path
               d="M9 16.5C5.3775 16.5 2.4375 13.56 2.4375 9.9375C2.4375 6.315 5.3775 3.375 9 3.375C12.6225 3.375 15.5625 6.315 15.5625 9.9375"
               stroke="#201F31" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
             <path d="M9 6V9.75" stroke="#201F31" stroke-width="1.2" stroke-linecap="round"
               stroke-linejoin="round" />
             <path d="M6.75 1.5H11.25" stroke="#201F31" stroke-width="1.2" stroke-miterlimit="10"
               stroke-linecap="round" stroke-linejoin="round" />
             <path d="M14.25 12.75V15.75" stroke="#201F31" stroke-width="1.2" stroke-linecap="round"
               stroke-linejoin="round" />
             <path d="M12 12.75V15.75" stroke="#201F31" stroke-width="1.2" stroke-linecap="round"
               stroke-linejoin="round" />
           </svg>
         </div>
         <div class="text-dark position-relative z-10">
           <p class="fs-10 opacity-70 mb-1 text-secondary">انقضا</p>
           <p class="fw-bold fs-14 mb-0">${
             setDate(user) ? setDate(user).format("YYYY/MM/DD") : "نامشخص"
           }</p>
         </div>
       </div>
     </div>
     <div class="d-flex align-items-center justify-content-between gap-3">
       <a data-userLink="userLink" class="position-relative overflow-hidden d-flex align-items-center justify-content-center gap-2 border rounded-15 h-48 flex-grow-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
           <path
             d="M16.5031 12.6269L17.4818 11.6482C19.4393 9.69068 19.4458 6.48218 17.4818 4.51819C15.5243 2.56069 12.3158 2.55421 10.3518 4.51819L9.37308 5.49695"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path
             d="M5.49048 9.37954L4.51821 10.3518C2.55422 12.3158 2.55422 15.5178 4.51821 17.4818C6.47572 19.4393 9.68422 19.4458 11.6482 17.4818L12.6205 16.5095"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path d="M8.40729 13.5927L13.5927 8.40726" stroke="#201F31" stroke-width="1.5" stroke-linecap="round"
             stroke-linejoin="round" />
         </svg>
         <p class="fw-bold fs-14 text-dark mb-0">لینک</p>
         <div class="copyCont">
            <p>کپی شد</p>
         </div>
       </a>
       <a data-userLinkQRCode="userLinkQRCode" class="d-flex align-items-center justify-content-center gap-2 border rounded-15 h-48 flex-grow-1">
         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
           <path d="M1.8333 8.25001V5.95834C1.8333 3.67584 3.6758 1.83334 5.9583 1.83334H8.24996"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path d="M13.75 1.83334H16.0416C18.3241 1.83334 20.1666 3.67584 20.1666 5.95834V8.25001"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path d="M20.1666 14.6667V16.0417C20.1666 18.3242 18.3241 20.1667 16.0416 20.1667H14.6666"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path d="M8.24996 20.1667H5.9583C3.6758 20.1667 1.8333 18.3242 1.8333 16.0417V13.75" stroke="#201F31"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path
             d="M9.62497 6.41666V8.24999C9.62497 9.16666 9.16664 9.62499 8.24997 9.62499H6.41664C5.49997 9.62499 5.04164 9.16666 5.04164 8.24999V6.41666C5.04164 5.49999 5.49997 5.04166 6.41664 5.04166H8.24997C9.16664 5.04166 9.62497 5.49999 9.62497 6.41666Z"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path
             d="M16.9583 6.41666V8.24999C16.9583 9.16666 16.5 9.62499 15.5833 9.62499H13.75C12.8333 9.62499 12.375 9.16666 12.375 8.24999V6.41666C12.375 5.49999 12.8333 5.04166 13.75 5.04166H15.5833C16.5 5.04166 16.9583 5.49999 16.9583 6.41666Z"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path
             d="M9.62497 13.75V15.5833C9.62497 16.5 9.16664 16.9583 8.24997 16.9583H6.41664C5.49997 16.9583 5.04164 16.5 5.04164 15.5833V13.75C5.04164 12.8333 5.49997 12.375 6.41664 12.375H8.24997C9.16664 12.375 9.62497 12.8333 9.62497 13.75Z"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
           <path
             d="M16.9583 13.75V15.5833C16.9583 16.5 16.5 16.9583 15.5833 16.9583H13.75C12.8333 16.9583 12.375 16.5 12.375 15.5833V13.75C12.375 12.8333 12.8333 12.375 13.75 12.375H15.5833C16.5 12.375 16.9583 12.8333 16.9583 13.75Z"
             stroke="#201F31" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
         </svg>
         <p class="fw-bold fs-14 text-dark mb-0">QR Code</p>
       </a>
     </div>
   </div>
 </div>`;
    });
    userStatus = document.querySelectorAll("[data-userStatus]");
    userLink = document.querySelectorAll("[data-userLink]");
    userLinkQRCode = document.querySelectorAll("[data-userLinkQRCode]");
    userEdit = document.querySelectorAll("[data-userEdit]");
    disableAccount = document.querySelectorAll("[data-disableAccount]");

    userStatus.forEach((item, index) => {
      item.addEventListener("click", () => {
        statusFunc(item, index);
        indexTargetItem = index;
      });
    });
    userLink.forEach((item, index) => {
      item.addEventListener("click", () => {
        userLinkHandFunc(item, index, "active");
        indexTargetItem = index;
      });
    });
    userLinkQRCode.forEach((item, index) => {
      item.addEventListener("click", () => {
        showQrCode(item, index, "active");
        indexTargetItem = index;
      });
    });
    userEdit.forEach((item, index) => {
      item.addEventListener("click", () => {
        userEditFun(item, index);
        indexTargetItem = index;
      });
    });
    disableAccount.forEach((item, index) => {
      item.addEventListener("change", (e) => {
        disableAccountFun(item, index, e);
        indexTargetItem = index;
      });
    });

    clearEventListener();
  };

  const getUser = async () => {
    if (!isSetKey) return userCont.classList.add("unsetKeyShow");
    const usersItem = document.querySelectorAll("[data-usersitem]");
    usersItem.forEach((item) => {
      item.remove();
    });
    userCont.classList.add("loadingShow");
    users = await fetch("https://api.kotah.sbs/userAjax?page=1", {
      headers: {
        Authorization: "Bearer " + key,
      },
    }).catch(() => {
      userCont.classList.add("alertShow");
      userCont.classList.remove("loadingShow");
      $("#userContAlert")[0].children[0].textContent =
        "دوباره تلاش کنید !! مشکل اتصال به سرور";
    });
    users = await users.json();
    userCont.classList.remove("loadingShow");
    setUser(users.data);
  };
  getUser();
  // dropdown
  dropdownBtn.forEach((item) => {
    item.addEventListener("click", function () {
      dropdownContent.forEach((items) => {
        items.classList.remove("active");
      });
      dropdownBtn.forEach((items) => {
        items.querySelectorAll("svg:last-child").forEach((item) => {
          item.classList.remove("active");
        });
      });
      item.nextElementSibling.classList.add("active");
      item.querySelector("svg:last-child").classList.add("active");
    });
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      let itemText = item.textContent;
      item.parentElement.previousElementSibling.querySelector("p").textContent =
        itemText;
      item.parentElement.classList.remove("active");
      item.parentElement.previousElementSibling
        .querySelector("svg:last-child")
        .classList.remove("active");
    });
  });

  // show users
  const getUsers = async (page) => {
    let newUsers = await fetch("https://api.kotah.sbs/userAjax?page=" + page, {
      headers: {
        Authorization: "Bearer " + key,
      },
    }).catch(() => {
      userCont.classList.add("alertShow");
      userCont.classList.remove("loadingShow");
      $("#userContAlert")[0].children[0].textContent =
        "دوباره تلاش کنید !! مشکل اتصال به سرور";
    });
    return newUsers.json();
  };
  const setPageUsers = async () => {
    let totalPages = Math.round(users.total/10)
    let newUsers = await getUsers(totalPages)
    if(newUsers.hasNext){
      totalPages++
    }
    pagesUsersCont.textContent = ''
    for (let index = 1; index <= totalPages; index++) {
      if (index > 10) return;
      const li = document.createElement("li");
      const button = document.createElement("button");
      li.appendChild(button);
      button.textContent = index;
      pagesUsersCont.appendChild(li);
      button.addEventListener("click", async () => {
        const usersItem = document.querySelectorAll("[data-usersitem]");
        usersItem.forEach((item) => {
          item.remove();
        });
        let newUsers = await getUsers(index);
        users = newUsers;
        setUser(users.data);
      });
    }
  };
  showUsers.addEventListener("click", async function () {
    pageId = 1;
    const usersItem = document.querySelectorAll("[data-usersitem]");
    usersItem.forEach((item) => {
      item.remove();
    });
    await getUsers(pageId);
    setUser(users.data);
    setPageUsers();
    document.querySelector(".header-container").classList.add("active");
    mainHoverSvg.forEach((items) => items.classList.remove("active"));
    this.querySelector("svg").classList.add("active");
    userCont.classList.remove("loadingShow");
    userCont.classList.add("allUsers");
  });

  showAvatar.addEventListener("click", function () {
    getUser();
    userCont.classList.remove("allUsers")
    document.querySelector(".header-container").classList.remove("active");
    mainHoverSvg.forEach((items) => items.classList.remove("active"));
    this.querySelector("svg").classList.add("active");
  });

  searchForm.addEventListener("submit",searchFunc);
  addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  addUserMinus.addEventListener("click", () => {
    if (addUserPcs.value <= 1) return;
    addUserPcs.value = Number(addUserPcs.value) - 1;
  });
  addUserPlus.addEventListener("click", () => {
    addUserPcs.value = Number(addUserPcs.value) + 1;
  });
  addUserPlus.addEventListener("change", () => {
    if (addUserPlus.checked) vipType = 1;
    else vipType = 2;
  });

  addUserBtn.addEventListener("click", async () => {
    let filterLets = ["+", "-", "."];
    filterLets.forEach((item, index) => {
      addUserPcs.value = addUserPcs.value.replace(item, "");
    });
    let data = {
      count: Number(addUserPcs.value),
      amount: `${addAccount.amountProduct}`,
      date: "",
      email: addUserEmail.value.trim(),
      productId: addAccount.productId,
      groupId: vipType,
    };
    data.name = Math.random().toString(36).substring(2);
    alertContainer.classList.remove("active");
    if (!addUserEmail.value) {
      alertContainer.classList.add("active");
      return (alertContainer.children[0].textContent =
        " لطفا ایمیل را وارد کنید");
    }
    data.date = new Date(
      moment().add(addAccount.expireDays, "d").format()
    ).toISOString();
    for (const key in data) {
      if (!data[key]) {
        switch (key) {
          case "date":
            alertContainer.classList.add("active");
            alertContainer.children[0].textContent =
              "لطفا مدت سرویس را انتخاب کنید";
            break;
          case "amount":
            alertContainer.classList.add("active");
            alertContainer.children[0].textContent =
              "لطفا حجم سرویس را انتخاب کنید";
            break;
        }
        return;
      }
    }
    await addAccountFunc(data);
  });
  editUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  statusUserLink.addEventListener("click", () => {
    userLinkHandFunc(statusUserLink, indexTargetItem, "active");
  });
  QRCodeStatus.addEventListener("click", () => {
    showQrCode(QRCodeStatus, indexTargetItem, "active");
  });
  closeQrCodeCont.addEventListener("click", () => {
    qrCodeContainer.classList.remove("active");
    qrCodeImg.textContent = "";
  });
  searchIconBtn.addEventListener("click", () => {
    searchFunc();
  });
};

document.addEventListener("DOMContentLoaded", main);
