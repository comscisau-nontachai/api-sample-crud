const BASE_URL = 'http://localhost:3000'

window.onload = async () => {
  await loadData()
}

const loadData = async () => {
  const response = await axios.get(`${BASE_URL}/users`)
  const users = response.data

  let userHtmlData = '<table>'

  for (let index = 0; index < users.length; index++) {
    let user = users[index];
    userHtmlData += `<tr>
          <td>${user.firstname} ${user.lastname}<td>
          <td><a href='index.html?id=${user.id}'><button data-id='${user.id}'>Edit</button></a>
          <button class='delete' data-id='${user.id}'>Delete</button>
          <td>
          </tr>`
  }

  userHtmlData += '</table>'

  let userDOM = document.getElementById('user')
  userDOM.innerHTML = userHtmlData

  //delete user
  let deleteDOMS = document.getElementsByClassName('delete')
  for (let i = 0; i < deleteDOMS.length; i++) {
    const element = deleteDOMS[i];
    element.addEventListener('click', async (event) => {
      // ดึงค่า id ที่ฝังไว้กับ data-id เพื่อใช้สำหรับ reference กลับไปยังฝั่ง Backend
      let id = event.target.dataset.id

      try {
        await axios.delete(`${BASE_URL}/users/${id}`)
        loadData();
      } catch (error) {
        console.log(error);
      }
    })

  }
}
