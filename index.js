const BASE_URL = 'http://localhost:3000'
let mode = 'CREATE'
let selectedId = -1
let title = 'Register form'

window.onload = async () => {
  // นำ parameter ทั้งหมดมาใส่ตัวแปร urlParams
  const urlParams = new URLSearchParams(window.location.search)

  const id = urlParams.get('id')
  if (id) {
    mode = 'EDIT'
    selectedId = id

    //prefill form
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOMs = document.querySelectorAll('input[name=gender]')
    let jobDOM = document.querySelector('input[name=job]')
    let responseMessageDOM = document.getElementById('response-message')
    let titleDOM = document.getElementById('title_form')
    let btnDOM = document.getElementById('btn_send')

    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`)
      const user = response.data

      titleDOM.innerText = 'Edit form'
      btnDOM.innerText = 'แก้ไข'
      firstNameDOM.value = user.firstname
      lastNameDOM.value = user.lastname
      ageDOM.value = user.age
      jobDOM.value = user.job

      for (let i = 0; i < genderDOMs.length; i++) {
        const element = genderDOMs[i];

        if (element.value == user.gender) {
          element.checked = true
        }
      }


    } catch (error) {
      console.log(error);
    }
  }else{
    let titleDOM = document.getElementById('title_form')
    titleDOM.innerText = 'Register form'
  }



}

const validateDate = (userData) => {
  let errors = []

  if (!userData.firstname) {
    errors.push('กรุณาใส่ชื่อจริง')
  }

  if (!userData.lastname) {
    errors.push('กรุณาใส่นามสกุล')
  }

  if (!userData.age) {
    errors.push('กรุณาใส่อายุ')
  }

  if (!userData.gender) {
    errors.push('กรุณาใส่เพศ')
  }
  if (!userData.job) {
    errors.push('กรุณาใส่อาชีพ')
  }

  return errors
}

const submitData = async () => {
  let firstNameDOM = document.querySelector('input[name=firstname]')
  let lastNameDOM = document.querySelector('input[name=lastname]')
  let ageDOM = document.querySelector('input[name=age]')
  let genderDOM = document.querySelector('input[name=gender]:checked') || {}
  let genderDOMs = document.querySelectorAll('input[name=gender]')
  let jobDOM = document.querySelector('input[name=job]')
  let responseMessageDOM = document.getElementById('response-message')


  try {
    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      job: jobDOM.value,

    }

    const errors = validateDate(userData)
    if (errors.length > 0) {
      throw {
        message: 'กรอกข้อมูลไม่ครบ',
        errors: errors
      }
    }

    let successMessage = 'เพิ่มข้อมูลเรียบร้อย !'
    let response = {}
    console.log(mode);
    if (mode == 'EDIT') {
      response = await axios.put(
        `${BASE_URL}/users/${selectedId}`,
        userData
      )

      successText = 'แก้ไขข้อมูลเรียบร้อย !'
    } else {
      response = await axios.post(
        `${BASE_URL}/users`,
        userData
      )

    }


    // หลัง response จาก axios เรียบร้อย = แสดง error message ออกมา
    responseMessageDOM.innerText = successMessage
    responseMessageDOM.className = 'message success'

    //clear form
    /* firstNameDOM.value = ''
    lastNameDOM.value = ''
    ageDOM.value = ''
    genderDOMs.get(0).checked = true
    jobDOM.value = '' */

  } catch (error) {

    let htmlData = '<div>'
    htmlData += `<div>${error.message}</div>`
    htmlData + '<ul>'

    for (let index = 0; index < error.errors.length; index++) {
      const element = error.errors[index];
      htmlData += `<li>${element}</li>`

    }

    htmlData + '</ul>'
    htmlData += '</div>'

    responseMessageDOM.innerHTML = htmlData
    responseMessageDOM.className = 'message danger'
  }
}

