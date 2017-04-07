const CLIENT_ID = '99caa50fc1c3cde';

function upload(image, src) {
	const entry = document.createElement('p');
	const img = document.createElement('img');
	img.src = src;
	img.style.maxWidth = '1.5em';
	img.style.maxHeight = '1.5em';
	img.style.verticalAlign = 'middle';
	entry.appendChild(img);
	entry.appendChild(document.createTextNode(' '));
	const progress = document.createElement('progress');
	entry.appendChild(progress);
	const cancelSpace = document.createTextNode(' ');
	entry.appendChild(cancelSpace);
	const cancel = document.createElement('input');
	cancel.type = 'button';
	cancel.value = 'Cancel';
	entry.appendChild(cancel);
	document.body.appendChild(entry);
	const data = new FormData();
	data.append('image', image);
	const xhr = new XMLHttpRequest();
	xhr.upload.onprogress = function (e) {
		progress.max = e.total;
		progress.value = e.loaded;
	};
	xhr.onloadend = function () {
		entry.removeChild(progress);
		entry.removeChild(cancelSpace);
		entry.removeChild(cancel);
		if (xhr.response) {
			if (xhr.response.success) {
				const direct = document.createElement('a');
				direct.href = xhr.response.data.link;
				direct.target = '_blank';
				entry.insertBefore(direct, img);
				direct.appendChild(img);
				const deletion = document.createElement('a');
				deletion.href = 'https://imgur.com/delete/' + xhr.response.data.deletehash;
				deletion.target = '_blank';
				deletion.textContent = 'Delete';
				entry.appendChild(deletion);
				entry.appendChild(document.createTextNode(' '));
				const light = document.createElement('a');
				light.href = '#' + xhr.response.data.id;
				light.target = '_blank';
				light.textContent = 'Light link';
				entry.appendChild(light);
			} else {
				const code = document.createElement('code');
				code.textContent = JSON.stringify(xhr.response);
				entry.appendChild(code);
			}
		} else {
			entry.appendChild(document.createTextNode('loadend with no response'));
		}
	};
	xhr.responseType = 'json';
	xhr.open('POST', 'https://api.imgur.com/3/image');
	xhr.setRequestHeader('Authorization', 'Client-ID ' + CLIENT_ID);
	xhr.send(data);
	cancel.onclick = function () {
		xhr.abort();
	};
}

const p = document.createElement('p');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.multiple = true;
fileInput.onchange = function () {
	for (let file of fileInput.files) {
		upload(file, URL.createObjectURL(file));
	}
	fileInput.value = null;
};
p.appendChild(fileInput);
p.appendChild(document.createTextNode(' '));
const urlInput = document.createElement('input');
urlInput.type = 'url';
urlInput.placeholder = 'Paste something';
urlInput.onpaste = function (e) {
	for (let file of e.clipboardData.files) {
		upload(file, URL.createObjectURL(file));
	}
};
urlInput.onchange = function () {
	if (urlInput.validity.valid && urlInput.value) {
		upload(urlInput.value, urlInput.value);
		urlInput.value = null;
	}
};
p.appendChild(urlInput);
document.body.appendChild(p);
