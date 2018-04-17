preload();
window.onload = load();

function load() {
    setTimeout(() => {
        document.querySelector('.app__preloader').classList.add('on-page-ready');
    }, 1200);
}
function preload() {

    class Menu {
        constructor(el) {
            this.DOM = {};
            this.DOM.menu = el;
            this.initMenu();
        }

        initMenu() {
            this.initMenuButton('.app__menu__button');
            this.initMenuTitles('.app__menu__title');
            this.initContact(this.DOM.menu.querySelector('section:last-child .app__menu__title'));
        }

        initMenuButton(childSelector) {
            this.DOM.menuButton = new MenuButton(this.DOM.menu.parentNode.querySelector(childSelector));
        }

        initMenuTitles(groupChildsSelector) {
            const groupChilds = Array.from(this.DOM.menu.querySelectorAll(groupChildsSelector));
            this.DOM.menuTitles = [];
            groupChilds.forEach(child => this.DOM.menuTitles.push(new MenuTitle(child)));
        }

        initContact(el) {
            this.DOM.contact = new Contact(el);
        }
    }

    class MenuButton {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.initMenuButton();
        }

        initMenuButton() {

            this.onScroll = (e) => {
                const appHeader = document.querySelector('.app__content header'),
                      appContent = document.querySelector('.app__content');
                if (appContent.scrollTop > appHeader.offsetHeight || window.scrollY > appHeader.offsetHeight) {
                    this.DOM.el.classList.add('app__menu__button--scroll');
                } else {
                    this.DOM.el.classList.remove('app__menu__button--scroll');
                }
            }

            this.DOM.el.addEventListener('click', this.toggleMenu);
            this.DOM.el.addEventListener('mouseenter', this.hoverMenu);
            this.DOM.el.addEventListener('mouseleave', this.hoverMenu);
            window.addEventListener('scroll', this.onScroll);
            document.querySelector('.app__content').addEventListener('scroll', this.onScroll);
        }

        hoverMenu(e) {
            if (e.type === 'mouseenter') {
                this.classList.add('app__menu__button--hover');
            } else {
                this.classList.remove('app__menu__button--hover');
            }
        }

        toggleMenu(e) {
            e.preventDefault();
            if (document.querySelector('.app').classList.toggle('app__menu--hidden')) {
                window.scrollTo(0, 0);
            }
            this.classList.toggle('app__menu__button--click');
            this.style.transform = (this.classList.contains('app__menu__button--click')) ? 'scale(0.9, 0.9)' : 'scale(1,1)';
        }
    }

    class MenuTitle {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.DOM.parent = el.parentNode;
            charming(this.DOM.el);
            this.DOM.letters = Array.from(this.DOM.el.querySelectorAll('span'));
            this.initMenuTitle();
        }

        initMenuTitle() {
            this.onMouseEnter = () => {
                this.mouseTimeout = setTimeout(() => {
                    this.DOM.parent.classList.add('app__menu__section--hover')
                    anime.remove(this.DOM.letters);
                    anime({
                        targets: this.DOM.letters,
                        duration: 600,
                        easing: [0.175, 0.885, 0.32, 1.275],
                        color: (t, i) => {
                            const colors = ['#a7d7ea', '#78bad3', '#509ab6', '#327d99'];
                            return colors[i%colors.length];
                        },
                        scale: (t,i) => this.randomize(0.3, 1.7, 2),
                        translateX: (t, i) => {
                            const elBounds = this.DOM.el.getBoundingClientRect();
                            const x1 = elBounds.left + elBounds.width/2;
                            const y1 = elBounds.top + elBounds.height/2;
                            
                            const targetBounds = t.getBoundingClientRect();
                            const x2 = targetBounds.left + targetBounds.width/2;
                            const y2 = targetBounds.top + targetBounds.height/2;
    
                            const dist = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
                            const maxDist = Math.sqrt(Math.pow(elBounds.left-x1,2) + Math.pow(elBounds.top-y1,2));
                            const maxTX = x2<x1?-250:250;
    
                            return (maxTX/maxDist*dist)/3;
                        },
                        translateY: (t, i) => anime.random(-20, 20),
                        rotateZ: (t, i) => anime.random(-40, 40),
                        opacity: (t,i) => this.randomize(0.1, 0.6, 1)
                    });
                }, 50);
            };

            this.onMouseLeave = () => {
                clearTimeout(this.mouseTimeout);
                this.DOM.parent.classList.remove('app__menu__section--hover')
                anime.remove(this.DOM.letters);
                anime({
                    targets: this.DOM.letters,
                    duration: 1200,
                    easing: [0.175, 0.885, 0.32, 1.275],
                    color: '#b3465b',
                    scale: 1,
                    translateX: 0,
                    translateY: 0,
                    rotateZ: 0,
                    opacity: 1
                });
            };

            this.onMouseClick = (e) => {
                e.preventDefault();
                const href = this.DOM.el.getAttribute('href');
                setTimeout(() => {
                    window.location = href;
                }, 1000);
            }

            this.DOM.parent.addEventListener('mouseenter', this.onMouseEnter);
            this.DOM.parent.addEventListener('mouseleave', this.onMouseLeave);
            if (this.DOM.el.getAttribute('href') !== 'contact.html') {
                this.DOM.parent.addEventListener('click', this.onMouseClick);
                this.DOM.el.addEventListener('click', this.onMouseClick);
            }
        }

        randomize(min, max, range) {
            let random = Math.random()*range;
                        while (random < min || random > max) {
                            random = Math.random(0,1);
                        }
                        return random;
        }
    }

    class AppContent {
        constructor(el) {
            this.DOM = {};
            this.DOM.appContent = el;
            this.initAppContent();
        }

        initAppContent() {
            this.initHeader('header');
        }

        initHeader(selector) {
            if (this.DOM.appContent.querySelector(selector)) {
                this.DOM.appContent.header = new AppHeader(this.DOM.appContent.querySelector(selector));
            }
        }
    }

    class AppHeader {
        constructor(el) {
            this.DOM = {};
            this.DOM.appHeader = el;
            this.DOM.appHeaderTail = el.querySelector('.header__tail');
            this.initAppHeader();
        }

        initAppHeader() {
           this.shuffleBG();
        }

        shuffleBG() {
            let headerBG = [
                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%23d9788b' stroke-width='72.2' stroke-opacity='0' %3E%3Ccircle fill='%23fafafa' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%23faf5f6' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%23faf0f2' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%23f9ecee' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23f9e7ea' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%23f9e2e6' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23f8dde2' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%23f8d9de' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23f8d4da' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%23f7cfd6' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%23f6cad2' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%23f6c6ce' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%23f5c1ca' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%23f4bcc6' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%23f4b7c3' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%23f3b3bf' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%23f2aebb' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23f1a9b7' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E")`,
                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23eaf3f7' d='M486%2C705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5%2C692.1%2C49%2C703%2C0%2C719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8%2C707.1%2C489.4%2C706.5%2C486%2C705.8z'/%3E%3Cpath fill='%23daecf4' d='M1600%2C0H0v719.8c49-16.8%2C99.5-27.8%2C150.7-33.5c111.9-12.7%2C226-2.4%2C335.3%2C19.4c3.4%2C0.7%2C6.8%2C1.4%2C10.2%2C2c116.8%2C24%2C231.7%2C59%2C347.6%2C92.2H1600V0z'/%3E%3Cpath fill='%23c9e5f0' d='M478.4%2C581c3.2%2C0.8%2C6.4%2C1.7%2C9.5%2C2.5c196.2%2C52.5%2C388.7%2C133.5%2C593.5%2C176.6c174.2%2C36.6%2C349.5%2C29.2%2C518.6-10.2V0H0v574.9c52.3-17.6%2C106.5-27.7%2C161.1-30.9C268.4%2C537.4%2C375.7%2C554.2%2C478.4%2C581z'/%3E%3Cpath fill='%23b8deed' d='M0%2C0v429.4c55.6-18.4%2C113.5-27.3%2C171.4-27.7c102.8-0.8%2C203.2%2C22.7%2C299.3%2C54.5c3%2C1%2C5.9%2C2%2C8.9%2C3c183.6%2C62%2C365.7%2C146.1%2C562.4%2C192.1c186.7%2C43.7%2C376.3%2C34.4%2C557.9-12.6V0H0z'/%3E%3Cpath fill='%23a7d7ea' d='M181.8%2C259.4c98.2%2C6%2C191.9%2C35.2%2C281.3%2C72.1c2.8%2C1.1%2C5.5%2C2.3%2C8.3%2C3.4c171%2C71.6%2C342.7%2C158.5%2C531.3%2C207.7c198.8%2C51.8%2C403.4%2C40.8%2C597.3-14.8V0H0v283.2C59%2C263.6%2C120.6%2C255.7%2C181.8%2C259.4z'/%3E%3Cpath fill='%23b2dced' d='M1600%2C0H0v136.3c62.3-20.9%2C127.7-27.5%2C192.2-19.2c93.6%2C12.1%2C180.5%2C47.7%2C263.3%2C89.6c2.6%2C1.3%2C5.1%2C2.6%2C7.7%2C3.9c158.4%2C81.1%2C319.7%2C170.9%2C500.3%2C223.2c210.5%2C61%2C430.8%2C49%2C636.6-16.6V0z'/%3E%3Cpath fill='%23bce1f0' d='M454.9%2C86.3C600.7%2C177%2C751.6%2C269.3%2C924.1%2C325c208.6%2C67.4%2C431.3%2C60.8%2C637.9-5.3c12.8-4.1%2C25.4-8.4%2C38.1-12.9V0H288.1c56%2C21.3%2C108.7%2C50.6%2C159.7%2C82C450.2%2C83.4%2C452.5%2C84.9%2C454.9%2C86.3z'/%3E%3Cpath fill='%23c7e7f4' d='M1600%2C0H498c118.1%2C85.8%2C243.5%2C164.5%2C386.8%2C216.2c191.8%2C69.2%2C400%2C74.7%2C595%2C21.1c40.8-11.2%2C81.1-25.2%2C120.3-41.7V0z'/%3E%3Cpath fill='%23d1ecf7' d='M1397.5%2C154.8c47.2-10.6%2C93.6-25.3%2C138.6-43.8c21.7-8.9%2C43-18.8%2C63.9-29.5V0H643.4c62.9%2C41.7%2C129.7%2C78.2%2C202.1%2C107.4C1020.4%2C178.1%2C1214.2%2C196.1%2C1397.5%2C154.8z'/%3E%3Cpath fill='%23dbf1fa' d='M1315.3%2C72.4c75.3-12.6%2C148.9-37.1%2C216.8-72.4h-723C966.8%2C71%2C1144.7%2C101%2C1315.3%2C72.4z'/%3E%3C/g%3E%3C/svg%3E")`,
                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='30' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23b3465b' stroke-width='0.5' stroke-opacity='0.56'%3E%3Cpath d='M-500%2C75c0%2C0%2C125-30%2C250-30S0%2C75%2C0%2C75s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3Cpath d='M-500%2C45c0%2C0%2C125-30%2C250-30S0%2C45%2C0%2C45s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3Cpath d='M-500%2C105c0%2C0%2C125-30%2C250-30S0%2C105%2C0%2C105s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3Cpath d='M-500%2C15c0%2C0%2C125-30%2C250-30S0%2C15%2C0%2C15s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3Cpath d='M-500-15c0%2C0%2C125-30%2C250-30S0-15%2C0-15s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3Cpath d='M-500%2C135c0%2C0%2C125-30%2C250-30S0%2C135%2C0%2C135s125%2C30%2C250%2C30s250-30%2C250-30s125-30%2C250-30s250%2C30%2C250%2C30s125%2C30%2C250%2C30s250-30%2C250-30'/%3E%3C/g%3E%3C/svg%3E");`,
            ],
                bgImg = headerBG[Math.floor(Math.random()*headerBG.length)];
                this.DOM.appHeader.style.backgroundImage = bgImg;
                if (this.DOM.appHeaderTail) this.DOM.appHeaderTail.style.backgroundImage = bgImg;
            setTimeout(() => {
                this.shuffleBG();
            }, 1000);
        }
    }

    class Contact {
        constructor(el) {
            this.DOM = {};
            this.DOM.contactButton = el;
            this.initContact();
        }
        initContact() {
            this.initContactModal = (e) => {
                e.preventDefault();
                this.initContactInfos();
                swal({
                    title: 'Retrouvez-moi ailleurs via...',
                    button: false,
                    content: this.contactInfos
                });
            }

            this.DOM.contactButton.addEventListener('click', this.initContactModal);
        } 

        initContactInfos() {
            let contactMethods = [
                {
                    name: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/thi-van-an-truong/',
                    img: 'images/common/contact-linkedin.svg'
                },
                {
                    name: 'Gmail',
                    href: 'mailto:vanan.sdsmnc.221@gmail.com',
                    img: 'images/common/contact-gmail.svg'
                },
                {
                    name: 'GitHub',
                    href: 'https://github.com/sdsmnc221',
                    img: 'images/common/contact-github.svg'
                },
                {
                    name: 'CodePen',
                    href: 'https://codepen.io/supastrocat/',
                    img: 'images/common/contact-codepen.svg'
                },
                {
                    name: 'Mini ArtBlog',
                    href: 'http://s-u-ndaysmaniac.tumblr.com',
                    img: 'images/common/contact-tumblr.png'
                }
            ];
            this.contactInfos = document.createElement('div');
            this.contactInfos.classList.add('contactInfos');
            contactMethods.forEach(e => {
                let contactMethod = document.createElement('a');
                contactMethod.setAttribute('title', `Mon ${e.name}`);
                contactMethod.setAttribute('href', e.href);
                contactMethod.setAttribute('target', '_blank');
                contactMethod.innerHTML = `<img src="${e.img}" alt="">`;
                this.contactInfos.appendChild(contactMethod);
            });
        }

        
        
    }

    const menu = (document.querySelector('.app__menu')) ? new Menu(document.querySelector('.app__menu')) : null,
          appContent = new AppContent(document.querySelector('.app__content'));

}