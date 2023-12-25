import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

const BASE_URL = 'https://locations-standalone.onrender.com';
class TestCutomeElement extends HTMLElement {
    connectedCallback() {
        // @ts-ignore
        const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value ?? '{}');
        const instanceId = wixconfig?.instanceId || '';

        const mountPoint = document.createElement('span');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${BASE_URL}/widget.css`;
        const shadowDom = this.attachShadow({ mode: 'open' })
        shadowDom.appendChild(link);
        shadowDom.appendChild(mountPoint);

        ReactDOM.render(React.createElement(App, { instanceId }), mountPoint);
    }
}

customElements.define('my-locations', TestCutomeElement);