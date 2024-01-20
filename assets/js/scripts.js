// dropdown

let dropdownBtn=Array.from(document.getElementsByClassName('dropdownBtn'));
let dropdownContent=Array.from(document.getElementsByClassName('dropdownContent'));
let dropdownItems=Array.from(document.querySelectorAll('.dropdownContent li'));

dropdownBtn.forEach((item)=>{
    item.addEventListener('click',function () {
        dropdownContent.forEach((items)=>{items.classList.remove('active')});
        dropdownBtn.forEach((items)=>{items.querySelectorAll('svg:last-child').forEach((item)=>{item.classList.remove('active')})});
        item.nextElementSibling.classList.add('active');
        item.querySelector('svg:last-child').classList.add('active');
    })
})

dropdownItems.forEach((item)=>{
    item.addEventListener('click',function () {
        let itemText=item.textContent;
        item.parentElement.previousElementSibling.querySelector('p').textContent=itemText;
        item.parentElement.classList.remove('active');
        item.parentElement.previousElementSibling.querySelector('svg:last-child').classList.remove('active');
    })
})

// show user

let showUser=document.getElementById('show-user');
let showAvatar=document.getElementById('show-avatar');
let mainHoverSvg=Array.from(document.getElementsByClassName('main-hover-svg'));

showUser.addEventListener('click',function () {
    document.querySelector('.header-container').classList.add('active');
    mainHoverSvg.forEach((items)=>items.classList.remove('active'));
    this.querySelector('svg').classList.add('active');
})
showAvatar.addEventListener('click',function () {
    document.querySelector('.header-container').classList.remove('active');
    mainHoverSvg.forEach((items)=>items.classList.remove('active'));
    this.querySelector('svg').classList.add('active');
})