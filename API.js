const API = 'https://test-users-api.herokuapp.com';

const container = document.querySelector('.users');
const userName = document.querySelector('#userName');
const userAge = document.querySelector('#userAge');
const buttonCreate = document.querySelector('#createUser');

function getUsers() {
    return fetch(API + '/users')
    .then(resolve => resolve.json())
    .then((res) => res.data)
    .catch((err) => {
        console.log("Can't GET users", err);
    });
}



function deleteUser(userId) {
    return fetch(API + '/users/' + userId, {
        method: 'DELETE'
    })
    .then(resolve => resolve.json())
    .then((res) => {
        if (res.status !== 200) {
            throw res.errors;
        }
    })
    .catch((err) => {
        console.log("Can't DELETE users", err);
    });
}

function renderUsers(users) {
    container.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'userCard';

        const divUser = document.createElement('div');

        function innerHTMLinput(user) {
            divUser.innerHTML = `
                <div><b>Name:</b> ${user.name}</div> 
                <div><b>Age: </b> ${user.age} </div>
            `            
        }

        function innerHTMLinputForm(user) {
            divUser.innerHTML = `   
                <label for="">
                    <span>Name:</span>
                    <input type="text" id="name-${user.id}" value="${user.name}">
                </label>     
                <label for="">
                    <span>Age:</span>
                    <input type="text" id="age-${user.id}" value="${user.age}">
                </label> 
                `
        }

        innerHTMLinput(user);
        div.append(divUser);

        // btnDelete
        const btnDelete = document.createElement('button');
        btnDelete.innerText = 'Delete';

        btnDelete.addEventListener('click', () => {
            deleteUser(user.id)
            .then(() => {
                div.remove();
            }).catch(() => {})
        })

        div.append(btnDelete);

        //btnEdit
        const btnEdit = document.createElement('button');
        btnEdit.innerText = 'Edit';

        btnEdit.addEventListener('click', () => {
            if (btnEdit.innerText == 'Edit') {
                innerHTMLinputForm(user);
                btnEdit.innerText = 'Save';
            } 
             else {
                const userEditName = document.querySelector(`#name-${user.id}`);
                console.log(`#name-${user.id}`, userEditName);

                const userEditAge = document.querySelector(`#age-${user.id}`);
                console.log(`#age-${user.id}`, userEditAge);

                const newUser = 
                {
                    name: userEditName.value,
                    age:  userEditAge.value,
                    id: user.id
                };
                saveUser(newUser).then(user => {
                    innerHTMLinput(user);
                    
                    console.log(user.name);
                });
                btnEdit.innerText = 'Edit';  
                         
             }

            console.log(user);
            
        })
        
        div.append(btnEdit);

        container.append(div);
    });
}

function listUser() {
    getUsers().then((users) => {
        console.log(users);
        //console.log(users[0].name);
        //console.log(users[0].id);
        renderUsers(users.reverse());
    });
}

buttonCreate.addEventListener('click', () => {
    const user = 
        {
            name: userName.value,
            age:  userAge.value
        };

    fetch(API + '/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(resolve => resolve.json())
    .then((res) => res.data)
    .then(({id}) => {
        user.id = id;
        listUser();
        userName.value = ''; 
        userAge.value = '';
    }).catch((err) => {
        console.log(err)
    })
})

function saveUser(user) {
    return fetch(API + '/users/' + user.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(resolve => resolve.json())
    .then((res) => res.data)
    .catch((err) => {
        console.log("Can't Update users", err);
    });
}

listUser();