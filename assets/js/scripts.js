// * 1. Render playlist
// * 2. Scroll top
// * 2.1 . Load song
// * 3. Play / Pause / Seek
// * 4. CD rotate
// * 5. Next / Prev
// * 6. Random
// * 7. Next / Repeat when end
// * 8. Active Song
// * 9. Scroll song when in to view
// * 10. Play song when click
// * 11. Change volume

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
/////////////////
const avatarMusic = $('.avatar');
const heading = $('.header h1');
const avatarSong = $('.img-music');
const audio = $('#audio');
const playBtn = $('.play-music');
const appPlayer = $('.app');
const rangeTree = $('.slider');
const btnPrev = $('.btn-previous');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playList = $('.play-list');
const treeVolume = $('.volume');
const showVolume = $('.show-volume');
const muteVolume = $('.mute-volume');
const PLAYER_STORAGE = 'NTĐ';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isVolume: 0,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    songs: [
        {
            name: 'Thức Giấc',
            singer: 'Da Lab',
            path: '../../assets/music/ThucGiac-DaLAB-7048212.mp3',
            img: '../../assets/img/thucgiac.jpg',
        },
        {
            name: '3107 3',
            singer: 'W/n,Duong,Nau,Titie',
            path: '../../assets/music/31073-WNDuonggNautitie-7059323.mp3',
            img: '../../assets/img/3107.jpg',
        },
        {
            name: 'Way Back Home',
            singer: 'SHAUN',
            path: '../../assets/music/WayBackHome-SHAUN-5564971.mp3',
            img: '../../assets/img/wbh.jpg',
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Pháo, Phúc Du, Độ Mixi...',
            path: '../../assets/music/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3',
            img: '../../assets/img/dotoc2.jpg',
        },
        {
            name: 'All Falls Down',
            singer: 'Alan Walker',
            path: '../../assets/music/AllFallsDown-AlanWalkerNoahCyrusDigitalFarmAnimalsJuliander-5817723.mp3',
            img: '../../assets/img/allfallsdown.jpg',
        },
        {
            name: 'Nevada',
            singer: 'Vicentone',
            path: '../../assets/music/Nevada-Vicetone-4494556.mp3',
            img: '../../assets/img/allfallsdown.jpg',
        },
        {
            name: 'Muôn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng MTP',
            path: '../../assets/music/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3',
            img: '../../assets/img/mrmsc.jpg',
        },
        {
            name: 'Phải Chăng Em Đã Yêu',
            singer: 'Juky San',
            path: '../../assets/music/PhaiChangEmDaYeu-JukySanRedT-6940932.mp3',
            img: '../../assets/img/pcemdy.jpg',
        },
        {
            name: 'Gặp Gỡ Yêu Đương Và Được Bên Em',
            singer: 'Phan Mạnh Quỳnh',
            path: '../../assets/music/GapGoYeuDuongVaDuocBenEm-PhanManhQuynh-7061898.mp3',
            img: '../../assets/img/pmq.jpg',
        },
        {
            name: 'Thế Thái',
            singer: 'Huong Ly',
            path: '../../assets/music/TheThai-HuongLy-6728509.mp3',
            img: '../../assets/img/the thai.jpg',
        },
        {
            name: 'Perfect',
            singer: 'EdSheeran',
            path: '../../assets/music/Perfect-EdSheeran-6445593.mp3',
            img: '../../assets/img/perfect.jpg',
        },
        {
            name: 'A Thousand Years',
            singer: 'BoyceAvenue',
            path: '../../assets/music/AThousandYears-BoyceAvenue-2470480.mp3',
            img: '../../assets/img/thou.jpg',
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map(
            (song, index) => `
           <div class="container-song ${
               index == this.currentIndex ? 'active' : ''
           }" data-index="${index}">
                <div class="avatar-song">
                    <div class="img-song" style="background-image: url('${song.img}');">
                    </div>
                </div>
                <div class="body">
                    <h4>${song.name}</h4>
                    <p>${song.singer}</p>
                </div>
                <div class="icon">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        );
        playList.innerHTML = htmls.join('');
    },
    handleSong: function () {
        const widthAvatar = avatarMusic.offsetWidth;
        document.onscroll = function () {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            const newWidth = widthAvatar - scroll;
            avatarMusic.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            avatarMusic.style.opacity = newWidth / widthAvatar;
        };
        const animateImg = avatarSong.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000,
            iterations: Infinity,
        });
        animateImg.pause();
        // play
        playBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onplay = () => {
            this.isPlaying = true;
            appPlayer.classList.add('play');
            animateImg.play();
        };
        audio.onpause = () => {
            this.isPlaying = false;
            appPlayer.classList.remove('play');
            animateImg.pause();
        };
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const rangePercent = Math.floor((audio.currentTime / audio.duration) * 100);
                rangeTree.value = rangePercent;
                // this.setConfig('currentTime', audio.currentTime);
            }
        };
        rangeTree.oninput = (e) => {
            const timeSong = (audio.duration / 100) * e.target.value;
            audio.currentTime = timeSong;
        };

        treeVolume.onchange = (e) => {
            this.isVolume = e.target.value;
            audio.volume = this.isVolume / 100;
            this.setConfig('volume', this.isVolume);
            showVolume.innerHTML = e.target.value + '%';
            muteVolume.classList.add('fa-volume-up');
            muteVolume.classList.remove('fa-volume-mute');
        };

        muteVolume.onclick = () => {
            if (muteVolume.matches('.fa-volume-up')) {
                audio.volume = 0;
                showVolume.innerHTML = 0 + '%';
                muteVolume.classList.remove('fa-volume-up');
                muteVolume.classList.add('fa-volume-mute');
            } else if (muteVolume.matches('.fa-volume-mute')) {
                audio.volume = this.config.volume / 100;
                showVolume.innerHTML = this.config.volume + '%';
                muteVolume.classList.add('fa-volume-up');
                muteVolume.classList.remove('fa-volume-mute');
            }
        };
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };
        btnNext.onclick = () => {
            if (this.isRandom) {
                this.randomSong();
            } else {
                this.nextSong();
            }
            audio.play();
            this.activeSong();
            this.scrollSongView();
        };
        btnPrev.onclick = () => {
            if (this.isRandom) {
                this.randomSong();
            } else {
                this.prevSong();
            }
            audio.play();
            this.activeSong();
            this.scrollSongView();
        };
        btnRandom.onclick = () => {
            this.isRandom = !this.isRandom;
            this.setConfig('isRandom', this.isRandom);
            btnRandom.classList.toggle('active', this.isRandom);
        };
        btnRepeat.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat);
            btnRepeat.classList.toggle('active', this.isRepeat);
        };
        playList.onclick = (e) => {
            const listSong = e.target.closest('.container-song:not(.active)');
            const iconSong = e.target.closest('.icon');
            if (listSong && !iconSong) {
                const index = Number(listSong.dataset.index);
                this.currentIndex = index;
                this.loadSong();
                this.activeSong();
                audio.play();
            }
        };
    },
    activeSong: function () {
        $$('.container-song').forEach((song, index) => {
            song.classList.remove('active');
            if (index === this.currentIndex) {
                song.classList.add('active');
            }
        });
    },
    scrollSongView: function () {
        setTimeout(function () {
            $('.container-song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 300);
    },
    randomSong: function () {
        let newSong;
        do {
            newSong = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === newSong);
        this.currentIndex = newSong;
        this.loadSong();
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadSong();
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    loadSong: function () {
        heading.textContent = this.currentSong.name;
        avatarSong.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
        this.setConfig('currentIndex', this.currentIndex);
        // if (this.currentTime === this.config.currentTime) {
        //     audio.currentTime = this.config.currentTime;
        // } else {
        //     audio.currentTime = 0;
        // }
    },
    loadConfig: function () {
        this.isVolume = this.config.volume;
        // treeVolume.value = this.isVolume;
        // audio.volume = this.isVolume / 100;
        // showVolume.innerHTML = this.isVolume + '%';
        this.currentIndex = this.config.currentIndex;
        // this.currentTime = this.config.currentTime;
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat);
    },
    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleSong();
        this.loadSong();
        this.render();
    },
};
app.start();
