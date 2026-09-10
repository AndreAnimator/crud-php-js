import { renderUsers, findUserById } from "./scripts/dom/render";
import { createUser } from "./scripts/api/create";
import { deleteUser } from "./scripts/api/delete";
import { updateUser, patchUser } from "./scripts/api/update";

const apiUrl = 'http://localhost:8000/api/users';

const form = document.getElementById('create-user-form');
const formError = document.getElementById('form-error');
const formTitle = document.getElementById('form-title');
const submitBtn = form.querySelector('button[type="submit"');
const cancelBtn = document.getElementById('cancel-edit');
const usersSection = document.getElementById('users');

let editingId = null;
let originalUser = null;

function showError(message) {
    formError.textContent = message;
    formError.classList.remove('d-none');
}

function hideError() {
    formError.classList.add('d-none');
    formError.textContent = '';
}

function getUserFromCard(button) {
    const card = button.closest('.user-card');
    return findUserById(Number(card.id));
}

function enterEditMode(user) {
    editingId = user.id;
    originalUser = { ...user };
    
    document.getElementById('name').value = user.name;
    document.getElementById('age').value = user.age;
    document.getElementById('email').value = user.email;

    formTitle.textContet = 'Edit User';
    submitBtn.textContent = 'Update';
    cancelBtn.style.display = '';

    document.getElementById('name').focus();
}

function exitEditMode() {
    editingId = null;
    originalUser = null;
    formTitle.textContet = 'Create User';
    submitBtn.textContent = 'Create';
    cancelBtn.style.display = 'none';
    form.reset();
}

cancelBtn.addEventListener('click', exitEditMode);

usersSection.addEventListener('click', async (event) => {
    const { target } = event;

    if (target.dataset.action === 'edit') {
        enterEditMode(getUserFromCard(target));
    }

    if (target.dataset.action === 'delete') {
        const user = getUserFromCard(target);

        if (!confirm('Are you sur you want to delete this user?')) return;

        try {
            await deleteUser(apiUrl, user.id);
            renderUsers(apiUrl);
        } catch (error) {
            showError(error.message);
        }
    }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;

    hideError();

    try {
        await createUser(apiUrl, { name, age, email });

        form.reset();
        renderUsers(apiUrl);
    } catch (error) {
        showError(error.message);
    }
});

document.addEventListener('DOMContentLoaded', () => renderUsers(apiUrl));





