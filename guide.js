fetch('./progress.json')
  .then(respone => respone.json())
  .then((data) => {

    const changeLng = {
      sell: '판매',
      donation: '기부',
      donation_history: '기부이력',
      etc: '피처폰',
      pick: '중고폰 수거',
      ai: 'AI 진단',
      history: '진단이력',
      eup: '클럽기변 반납',
      gup: 'GUP 반납'
    }
    const category = document.querySelector('#category');
    const step = document.querySelector('#step');
    const animation = document.querySelector('#animation');
    const errorMode = document.querySelector('#errorMode');
    const apply = document.querySelector('#apply');

    categoryLoad()
    stepListLoad()

    category.addEventListener('change', function () {
      step.innerHTML = ''
      if (category.value === 'eup' || category.value === 'gup') {
        errorMode.disabled = false
      }
      else {
        errorMode.disabled = true
        errorMode.value = '0'
      }
      stepListLoad(Boolean(Number(errorMode.value)))
    });

    errorMode.addEventListener('change', function (e) {
      step.innerHTML = ''
      stepListLoad(Boolean(Number(e.target.value)))
    });

    apply.addEventListener('click', function () {
      progress.render({
        category: category.value,
        step: Number(step.value),
        animation: Boolean(Number(animation.value)),
        errorMode: Boolean(Number(errorMode.value))
      });
    })

    function categoryLoad() {
      for (const key in data) {
        category.innerHTML +=
          '<option value="' + key + '">' + changeLng[key] + '</option>'
      }
    };

    function stepListLoad(errorMode) {
      let stepList = []
      if (errorMode) {
        for (const key in data[category.value]['dangerTitle']) {
          stepList.push(Number(key))
        }
      }
      else {
        for (const key in data[category.value]['title']) {
          stepList.push(Number(key))
        }
      }
      stepList.sort()
      stepList.forEach((el) => {
        step.innerHTML +=
          '<option value="' + el + '">' + el + '</option>'
      })
    };
  })