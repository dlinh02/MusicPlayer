const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const isRandom = false
const repeatBtn = $('.btn-repeat')
const isRepeat = false

// console.log(audio)

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs:[
        {
            name:'Là Anh',
            singer: 'Phạm Lịch',
            path: './assets/music/LaAnh.mp3',
            image: './assets/img/LaAnh.png'
        },
        {
            name:'Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau',
            singer: 'O.lew',
            path: './assets/music/RoiTaSeNgamPhaoHoaCungNhau.mp3',
            image: './assets/img/RoiTaSeNgamPhaoHoaCungNhau.png'
        },
        {
            name:'Vì em chưa bao giờ khóc',
            singer: 'Hà Nhi',
            path: './assets/music/ViEmChuaBaoGioKhoc.mp3',
            image: './assets/img/ViEmChuaBaoGioKhoc.png'
        },
        {
            name:'Sau này hãy gặp lại nhau khi hoa nở',
            singer: 'Nguyên Hà',
            path: './assets/music/SauNayHayGapLaiNhauKhiHoaNo.mp3',
            image: './assets/img/SauNayHayGapLaiNhauKhiHoaNo.png'
        },
        {
            name:'Rồi người thương cũng hoá người dưng',
            singer: 'Hiền Hồ',
            path: './assets/music/RoiNguoiThuongCungHoaNguoiDung.mp3',
            image: './assets/img/RoiNguoiThuongCungHoaNguoiDung.png'
        },
        {
            name:'Có Như Không Có',
            singer: 'Hiền Hồ',
            path: './assets/music/CoNhuKhongCo.mp3',
            image: './assets/img/CoNhuKhongCo.png'
        },
    ],

    render: function () {
        const htmls = this.songs.map(song =>{
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth /cdWidth
        }

        //Xử lý CD quay
        const cdThumdAnimate = cdThumd.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10s
            interations: Infinity // quay vô hạn
        })

        cdThumdAnimate.pause()

        //xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi song play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumdAnimate.play()
        }

        //khi song pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumdAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
           if(audio.duration){
            const progressPercent = (audio.currentTime / audio.duration) * 100
            progress.value = progressPercent
           }
        }

        //xử lý khi tua bài hát
        progress.onchange = function(e){
           const seekTime = audio.duration /100 * e.target.value
           audio.currentTime = seekTime
        }

        //Xử lý nextSong
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
        }

        //Xử lý prevSong
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
        }

        //xử lý bật/tắt random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xử lý bật/tắt repeat 
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý nextSong khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

    },

    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe, xử lý các sự kiện 
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()
    },
}

app.start();