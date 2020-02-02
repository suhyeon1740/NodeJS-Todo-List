const makeList = (todo) => {
    let li = document.createElement('li')
    li.id = todo.id
    let state = todo.do == 1 ? 'checked' : ''
    li.innerHTML = `<label class="${state}">
            <input type="checkbox" ${state}>${todo.content}
        </label>`
    let btn = document.createElement('i')
    btn.classList.add('trash','fas', 'fa-trash-alt')
    btn.addEventListener('click', removeList)
    li.appendChild(btn)
    li.addEventListener('click', clickList)
    document.getElementById('list').appendChild(li)
}

const removeList = (e) => {       
    $.ajax({
        url: `/todos/${e.target.parentNode.id}`,
        type: 'DELETE',
        success: function(res) {
            if(res.result) {
                document.getElementById('list').removeChild(e.target.parentNode)   
            }
        },
        error: function() {
            alert('할일 삭제 실패')
        }
    })
    
}

const clickList = (e) => {    
    if (e.target.tagName !== 'INPUT') return
    var checked = e.target.checked ? 1 : 0
    var label = e.target.parentNode
    $.ajax({
        url: `/todos/${label.parentNode.id}/${checked}`,
        type: 'PUT',
        success: function (res) {
            //console.log(result)
            if (res.result) {
                if (checked)
                    label.classList.add('checked')
                else label.classList.remove('checked')
            }            
        },
        error: function () {
            alert('상태 갱신 실패')
        }
    })    
}

const addList = () => {
    let content = document.getElementById('content').value
    if (!content) {
        alert('내용을 입력하세요.')
        return
    }
    $.ajax({
        url: `/todos`,
        type: 'POST',
        data: {
            'content': content
        },
        dataType: 'json',
        success: function (res) {
            //console.log(res)
            makeList(res)
            document.getElementById('content').value = ''
        },
        error: function () {
            alert('할일 추가 실패')
        }
    })
    
}

document.getElementById('add').addEventListener('click', addList)

document.getElementById('content').addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        addList()
    }
})

const getData = () => {
    $.ajax({
        url: `/todos`,
        type: 'GET',        
        success: function(rows) {
            //console.log(rows)
            rows.forEach(row => {
                makeList(row)
            });            
        },
        error: function() {
            alert('데이터 가져오기 실패')
        }
    })
}

getData()
