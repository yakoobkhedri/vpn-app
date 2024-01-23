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
  
    const showUser = document.getElementById("show-user"),
      showAvatar = document.getElementById("show-avatar"),
      mainHoverSvg = Array.from(
        document.getElementsByClassName("main-hover-svg")
      );
  
    const productCont = document.querySelector("#productCont"),
      searchProduct = document.querySelector("#searchProduct"),
      statusProductLink = document.querySelector("#statusProductLink"),
      QRCodeStatus = document.querySelector("#QRCodeStatus"),
      searchForm = document.querySelector("#formSearchBar"),
      qrCodeImg = document.querySelector(".qrCodeImg"),
      qrCodeContainer = document.querySelector("#qrCodeContainer"),
      closeQrCodeCont = document.querySelector("#closeQrCodeCont");
    const addProductForm = document.querySelector("#addProductForm");
  
    const editProductForm = document.querySelector("#editProductForm"),
      editProductName = document.querySelector("#editProductName"),
      editProductVip = document.querySelector("#editProductVip"),
      editProductVipPlus = document.querySelector("#editProductVipPlus"),
      editProductDateExpire = document.querySelector("#editProductDateExpire"),
      editProductSizeContent = document.querySelector("#editProductSizeContent"),
      editProductSize = document.querySelectorAll("#editProductSize"),
      editProductPcsMinus = document.querySelector("#editProductPcsMinus"),
      editProductPcsVal = document.querySelector("#editProductPcsVal"),
      editProductPcsPlus = document.querySelector("#editProductPcsPlus");
  
    let products,
      indexTargetItem,
      productStatus,
      productLink,
      productLinkQRCode,
      productsItem,
      productEdit;
  
    let timeOut;
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
    const key = getCookie("key");
    const setValueAsGb = (isTraffic = false, index) => {
      let traffic;
      let used;
      if (isTraffic) {
        if (String(products.data[index].info.traffic).includes("TB")) {
          traffic =
            Number(products.data[index].info.traffic.replace("TB", "")) *
            10 ** +3;
        } else if (String(products.data[index].info.traffic).includes("GB")) {
          traffic = Number(products.data[index].info.traffic.replace("GB", ""));
        } else if (String(products.data[index].info.traffic).includes("MB")) {
          traffic =
            Number(products.data[index].info.traffic.replace("MB", "")) *
            10 ** -3;
        } else if (String(products.data[index].info.traffic).includes("KB")) {
          traffic =
            Number(products.data[index].info.traffic.replace("KB", "")) *
            10 ** -6;
        }
        return traffic;
      }
  
      if (String(products.data[index].info.used).includes("TB")) {
        used =
          Number(products.data[index].info.used.replace("TB", "")) * 10 ** +3;
      } else if (String(products.data[index].info.used).includes("GB")) {
        used = Number(products.data[index].info.used.replace("GB", ""));
      } else if (String(products.data[index].info.used).includes("MB")) {
        used =
          Number(products.data[index].info.used.replace("MB", "")) * 10 ** -3;
      } else if (String(products.data[index].info.used).includes("KB")) {
        used =
          Number(products.data[index].info.used.replace("KB", "")) * 10 ** -6;
      }
      return used;
    };
    const statusFunc = (item, index) => {
      // to GB
      let used = setValueAsGb(false, index);
      let traffic = setValueAsGb(true, index);
      // set status range as 100%
      let usedTraf = Math.abs((used / traffic) * 100 - 100);
      $(
        ".progress-bar.value"
      )[0].style = `  background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
      conic-gradient(#0f64fd ${usedTraf}%, #f4f4f4 0)`;
  
      $(".progress-bar.credit")[0].style = `background:
      radial-gradient(closest-side, white 79%, transparent 80% 100%),
      conic-gradient(#201f31 ${1}%, #f4f4f4 0)`;
      $("#productSize")[0].textContent = `${(traffic - used).toFixed(
        2
      )}/${traffic} گیگابایت `;
      $("#productName")[0].textContent = products.data[index].email;
      $("#productDate")[0].textContent = products.data[index].expire;
    };
    const productLinkHandFunc = (item, index, classs) => {
      navigator.clipboard.writeText(products.data[index].info.subLink);
      timeOut === undefined ? [] : clearTimeout(timeOut);
      if (item.classList.contains(classs)) return;
      item.classList.add(classs);
      setTimeout(() => {
        item.classList.remove(classs);
      }, 2000);
    };
    const showQrCode = (item, index, classs) => {
      new QRCode(qrCodeImg, {
        text: products.data[index].info.subLink,
        width: 250,
        height: 250,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrCodeContainer.classList.add(classs);
    };
    const productEditFun = (item, index) => {
      editProductName.value = products.data[index].email;
      console.log(editProductSizeContent);
      editProductSizeContent.textContent = `${setValueAsGb(
        true,
        index
      )} گیگابایت`;
    };
    const clearEventListener = () => {
      productStatus = document.querySelectorAll("#productStatus");
      productLink = document.querySelectorAll("#productLink");
      productLinkQRCode = document.querySelectorAll("#productLinkQRCode");
      productEdit = document.querySelectorAll("#productEdit");
      productStatus.forEach((item, index) => {
        item.removeEventListener("click", () => {
          statusFunc(item, index);
          indexTargetItem = index;
        });
      });
      productLink.forEach((item, index) => {
        item.removeEventListener("click", () => {
          productLinkHandFunc(item, index, "active");
          indexTargetItem = index;
        });
      });
      productLinkQRCode.forEach((item) => {
        item.removeEventListener("click", () => {
          showQrCode(item, index, "active");
          indexTargetItem = index;
        });
      });
      productEdit.forEach((item, index) => {
        item.removeEventListener("click", () => {
          productEditFun(item, index);
          indexTargetItem = index;
        });
      });
    };
    const setProduct = async (products) => {
      productCont.classList.add("showEmpty");
      if (products.data == undefined || products.data == "") return;
      else productCont.classList.remove("showEmpty");
      products.data.forEach((product, index) => {
        let traffic = product.info.traffic;
        let used = product.info.traffic;
        if (String(products.data[index].info.traffic).includes("GB")) {
          traffic = Number(products.data[index].info.traffic.replace("GB", ""));
        } else if (String(products.data[index].info.traffic).includes("MB")) {
          traffic =
            Number(products.data[index].info.traffic.replace("MB", "")) *
            10 ** -3;
        }
        if (String(products.data[index].info.used).includes("GB")) {
          used = Number(products.data[index].info.used.replace("GB", ""));
        } else if (String(products.data[index].info.used).includes("MB")) {
          used =
            Number(products.data[index].info.used.replace("MB", "")) * 10 ** -3;
        }
        let realTraffic = (Number(traffic) - Number(used)).toFixed(2);
        let email = product.email;
  
        productCont.innerHTML += ` 
    <div id="productsItem" class="rounded-15 border overflow-hidden mb-3">
     <div class="d-flex align-items-center justify-content-between bg-gray p-3">
       <div class="d-flex align-items-center gap-1">
         <div class="form-check form-switch d-flex">
           <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
         </div>
         <label id="productStatus" class="form-check-label cursor-pointer fs-14 fw-bold" data-bs-toggle="offcanvas" data-bs-target="#currentService" aria-controls="offcanvasBottom">${email}</label>
       </div>
       <a id="productEdit" data-bs-toggle="offcanvas" data-bs-target="#editUser" aria-controls="offcanvasBottom">
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
             <p class="fw-bold fs-14 mb-0">${realTraffic} گیگابایت</p>
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
             <p class="fw-bold fs-14 mb-0">''</p>
           </div>
         </div>
       </div>
       <div class="d-flex align-items-center justify-content-between gap-3">
         <a id="productLink" class="position-relative overflow-hidden d-flex align-items-center justify-content-center gap-2 border rounded-15 h-48 flex-grow-1">
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
         <a id="productLinkQRCode" class="d-flex align-items-center justify-content-center gap-2 border rounded-15 h-48 flex-grow-1">
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
  
      productStatus = document.querySelectorAll("#productStatus");
      productLink = document.querySelectorAll("#productLink");
      productLinkQRCode = document.querySelectorAll("#productLinkQRCode");
      productEdit = document.querySelectorAll("#productEdit");
  
      productStatus.forEach((item, index) => {
        item.addEventListener("click", () => {
          statusFunc(item, index);
          indexTargetItem = index;
        });
      });
      productLink.forEach((item, index) => {
        item.addEventListener("click", () => {
          productLinkHandFunc(item, index, "active");
          indexTargetItem = index;
        });
      });
      productLinkQRCode.forEach((item, index) => {
        item.addEventListener("click", () => {
          showQrCode(item, index, "active");
          indexTargetItem = index;
        });
      });
      productEdit.forEach((item, index) => {
        item.addEventListener("click", () => {
          productEditFun(item, index);
          indexTargetItem = index;
        });
      });
      clearEventListener();
    };
  
    const getProduct = async () => {
      productCont.classList.add("loadingShow");
      products = await (
        await fetch("https://api.kotah.sbs/userAjax?page=1", {
          headers: {
            Authorization: "Bearer " + key,
          },
        })
      ).json();
      productCont.classList.remove("loadingShow");
      setProduct(products);
    };
    getProduct();
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
  
    // show user
  
    showUser.addEventListener("click", function () {
      document.querySelector(".header-container").classList.add("active");
      mainHoverSvg.forEach((items) => items.classList.remove("active"));
      this.querySelector("svg").classList.add("active");
    });
    showAvatar.addEventListener("click", function () {
      document.querySelector(".header-container").classList.remove("active");
      mainHoverSvg.forEach((items) => items.classList.remove("active"));
      this.querySelector("svg").classList.add("active");
    });
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearEventListener();
      productsItem = document.querySelectorAll("#productsItem");
      productsItem.forEach((item) => {
        item.remove();
      });
      productCont.classList.add("loadingShow");
      productCont.classList.remove("showEmpty");
      products = await (
        await fetch(
          "https://api.kotah.sbs/userAjax?page=1&q=" + searchProduct.value.trim(),
          {
            headers: {
              Authorization: "Bearer " + key,
            },
          }
        )
      ).json();
      setProduct(products);
      productCont.classList.remove("loadingShow");
    });
    editProductForm.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    statusProductLink.addEventListener("click", () => {
      productLinkHandFunc(statusProductLink, indexTargetItem, "active");
    });
    QRCodeStatus.addEventListener("click", () => {
      showQrCode(QRCodeStatus, indexTargetItem, "active");
    });
    closeQrCodeCont.addEventListener("click", () => {
      qrCodeContainer.classList.remove("active");
      qrCodeImg.textContent = "";
    });
  };
  
  document.addEventListener("DOMContentLoaded", main);
  