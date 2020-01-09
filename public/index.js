window.onload = async function () {
    const form = document.querySelector('form');
    const API_URL = 'http://localhost:8080/api/mews';
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tweetData = getTweetData(event);
        if (!tweetData['name'] || !tweetData['mew']) { displayRequiredFields(tweetData); return; }
        showHideLoading(); showHideForm();
        sendMew(tweetData, API_URL).then(() => { loadAllMews(); showHideLoading(); setTimeout(() => showHideForm(), 15000) }).catch((er) => {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
            showHideLoading(); showHideForm();
        }); form.reset();
    });

    var getTweetData = function (event) {
        if (!event) return; const tweetData = {}, formData = new FormData(form);
        tweetData['name'] = formData.get('name'); tweetData['mew'] = formData.get('mew');
        return { 'name': tweetData['name'] ? tweetData['name'] : null, 'mew': tweetData['mew'] ? tweetData['mew'] : null };
    }
    var showHideLoading = function () {
        const loading = document.getElementsByClassName('loading')[0];
        if (loading.style.display == 'block') loading.style.display = 'none';
        else loading.style.display = 'block'; return;
    }
    var showHideForm = function () {
        const form = document.getElementsByClassName('mew-form')[0];
        if (form.style.display == 'block') form.style.display = 'none';
        else form.style.display = 'block'; return;
    }
    var displayRequiredFields = function (tweetData) {
        if (!tweetData) return;
        const name = document.getElementById('name'), mew = document.getElementById('mew');
        if (!tweetData['name']) { name.style.borderColor = 'red'; }
        if (!tweetData['mew']) { mew.style.borderColor = 'red'; }
        setTimeout(() => { name.style.borderColor = ''; mew.style.borderColor = ''; }, 2000);
        return;
    }
    var sendMew = async function (tweetData, API_URL) {
        if (!tweetData || !tweetData['name'] || !tweetData['mew'] || !API_URL) return;
        return fetch(API_URL, { method: 'POST', body: JSON.stringify(tweetData), headers: { 'content-type': 'application/json' } });
    }
    var downloadMews = async function (API_URL) {
        if (!API_URL) return;
        return fetch(API_URL, { method: 'GET', headers: { 'content-type': 'application/json' } });
    }
    var loadAllMews = function () {
        downloadMews(API_URL).then((data) => {
            data.json().then((mews) => {
                if (!mews.length) return;
                const parent = document.getElementsByClassName('mews')[0]; parent.innerHTML = '';
                mews = mews.reverse(); mews.forEach((mew) => {
                    if (!mews.length) return;
                    const div = document.createElement('div'); div.classList.add('mewDiv');
                    const header = document.createElement('h3'); header.textContent = mew.name; header.classList.add('mewer');
                    const contents = document.createElement('p'); contents.textContent = mew.mew;
                    div.appendChild(header); div.appendChild(contents); parent.appendChild(div);
                });
            })
        }).catch(() => { });
    }
    loadAllMews();
}