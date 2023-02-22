class Progress {
  render(setValue) {
    if (!setValue || !setValue.step) return;
    fetch('./progress.json')
      .then(respone => respone.json())
      .then(dataObj => {
        this.setValue = setValue
        this.setValue = setValue;
        this.category = setValue?.category || 'sell'
        this.step = setValue?.step
        this.animation = setValue?.animation
        this.errorMode = setValue?.errorMode
        this.category = dataObj[this.category]
        this.titleType = this.errorMode && this.category.dangerTitle ?
          this.category.dangerTitle : this.category?.title
        this.setColor = this.errorMode && this.category.dangerTitle ?
          'danger' : ''
        this.characterType = this.errorMode && this.category.dangerTitle ?
          'illust_progress_danger' : 'illust_progress'
        this.step = this.titleType[this.step] ?
          this.step : Math.floor(this.step)
        this.stepList = this.category.step
        this.stepCount = this.stepList.length
        this.stepDesc = this.titleType[this.step]
        this.stepInterval = 100 / (this.stepList?.length + 1)
        this.progress = this.step * this.stepInterval
        this.gauge = this.animation ? this.progress - (this.stepInterval / 2) : this.progress
        this.screateStep = ''

        if (!this.titleType[this.step]) {
          for (let i = this.step - 0.5; i >= 0; i -= 0.5) {
            if (this.titleType[i]) {
              this.stepDesc = this.titleType[i]
              break;
            }
          }
        }

        this.stepList?.forEach((el, idx) => {
          this.screateStep += `
          <figure data-step="${idx + 1}" style="left:${(idx + 1) * this.stepInterval}%">
            <strong class="step-success">√</strong>
            <strong class="step-towards">${idx + 1}</strong>
            <p class="step-title">
              ${el}
            </p>
          </figure>
          `
        })

        document.querySelector('#progress').innerHTML = `
          <div class="progress-mini ${this.setColor}">
            <span class="step-mini-bar" style="width:${this.gauge}%"></span>
          </div>
          <div class="progress-wrap ${this.setColor}">
            <header class="step-description">
              ${this.stepDesc}
            </header>
            <section class="step-list">
              ${this.screateStep}
              <div class="step-bar">
                <span class="step-gage" style="width:${this.progress}%"></span>
                <img src="./${this.characterType}.svg" alt="" class="step-icon" style="margin-left:${this.progress}%">
              </div>
            </section>
            <footer>
              <button class="open-close">닫기</button>
            </footer>
          </div>
          `
      })
      .then(() => {
        this.animationPlay()
        document.querySelectorAll('[data-step]').forEach((el) => {
          if (el.dataset.step <= this.step) {
            el.querySelector('.step-title').innerHTML += `완료`
          }
          if (el.dataset.step < this.step) {
            el.classList.add('succes')
          }
        })

        if (this.step <= this.stepCount) {
          (this.step / 0.5) % 2 !== 0 ?
            document.querySelector(`[data-step="${this.step + 0.5}"]`).classList.add('towards') :
            document.querySelector(`[data-step="${this.step}"]`).classList.add('towards')
        }

        document.querySelector('.open-close')?.addEventListener('click', (e) => {
          if (e.target.innerText === '닫기') {
            document.querySelector('.progress-wrap').classList.add('hide')
            e.target.innerText = '열기'
          }
          else {
            document.querySelector('.progress-wrap').classList.remove('hide')
            this.animationPlay()
            e.target.innerText = '닫기'
          }
        })
      })
  }

  animationPlay() {
    if (this.animation) {
      let stepBar = document.querySelector('.step-bar')
      let stepGage = document.querySelector('.step-gage')
      let stepIcon = document.querySelector('.step-icon')
      let stepMini = document.querySelector('.step-mini-bar')
      if (this.step > this.stepCount) {
        stepBar.classList.remove('is-ani')
        stepGage.style.width = `${this.stepInterval * (this.stepCount)}%`
        stepIcon.style.marginLeft = `${this.stepInterval * (this.stepCount)}%`
        setTimeout(() => {
          stepBar.classList.add('is-ani')
          stepMini.style.width = `${this.stepInterval * (this.stepCount + 1)}%`
          stepGage.style.width = `${this.stepInterval * (this.stepCount + 1)}%`
        }, 500)
      } else {
        stepBar.classList.remove('is-ani')
        stepGage.style.width = `${this.progress - (this.stepInterval / 2)}%`
        stepIcon.style.marginLeft = `${this.progress - (this.stepInterval / 2)}%`
        setTimeout(() => {
          stepBar.classList.add('is-ani')
          stepMini.style.width = `${this.progress}%`
          stepGage.style.width = `${this.progress}%`
          stepIcon.style.marginLeft = `${this.progress}%`
        }, 500)
      }
    }
  }
}
var progress = new Progress()