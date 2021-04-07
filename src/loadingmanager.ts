/* eslint-disable @typescript-eslint/ban-types */


import { THREE }  from "./three";


type OnProgress = ((url: string, loaded: number, total: number) => void) | undefined;
type OnLoad = (() => void) | undefined
type OnError = ((url: string) => void) | undefined;

export interface LoaderStyle {
    container?: Partial<CSSStyleDeclaration>,
    inner?: Partial<CSSStyleDeclaration>,
    title?: Partial<CSSStyleDeclaration>,
    progress?: Partial<CSSStyleDeclaration>,
    progressValue?: Partial<CSSStyleDeclaration>,
}

class UI{
    containerDiv: HTMLElement;
    customStyle: LoaderStyle | undefined;
    lastLoadPercentage = 0;
    divs = {
            inner: document.createElement('div'),
            title: document.createElement('div'),
            progress: document.createElement('div'),
            progressValue: document.createElement('div')
        }
    public css: LoaderStyle = {
            container: { //
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: '0px',
                left: '0px',
                zIndex: '10000',
                backgroundColor: 'rgba(0,0,0,0.8)',
                fontFamily: 'sans-serif',
                color: 'rgba(255,255,255,1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 500ms'
            },
            inner: {
                maxWidth: '400px',
                textAlign: 'center'
            },
            title: {
                fontSize: '20px'
            },
            progress: {
                background: 'rgba(255,255,255, 0.1)',
                justifyContent: 'flex-start',
                borderRadius: '100px',
                alignItems: 'center',
                position: 'relative',
                padding: '0 5px',
                display: 'flex',
                height: '15px',
                width: '250px',
                margin: '15px'
            },
            progressValue: {
                boxShadow: '0 10px 40px -10px #fff',
                borderTopLeftRadius: '100px',
                borderBottomLeftRadius: '100px',
                background: 'rgba(255,255,255,1)',
                height: '10px',
                width: '0',
                transition: 'width 500ms',
            }
        }

    constructor(style?: LoaderStyle) {
        this.customStyle = style;
        this.containerDiv = document.createElement("div");
    }

    // update loading bar based on % = (n-loaded / n-total * 100)
    public updateLoader = (load_percentage: number) => {
        if(load_percentage < this.lastLoadPercentage) return;
        this.lastLoadPercentage = load_percentage;

        const elem = document.getElementById("zappar-loader-progressValue") as HTMLElement;
        elem.style.width = load_percentage + '%';
        elem.style.borderTopRightRadius = load_percentage + 'px';
        elem.style.borderBottomRightRadius = load_percentage + 'px';

        elem.addEventListener("transitionend", () => {
            if (load_percentage == 100) {
                this.containerDiv.style.opacity = "0";
                this.containerDiv.addEventListener("transitionend", (ev) => {
                    if (ev.propertyName == 'opacity') {
                        this.dispose();
                    }
                });
            }
        });
    }


    public dispose = () => {
        this.containerDiv.remove();
    }

    public initialize() {

        for(const key in this.divs){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.divs as unknown as any)[key].id = `zappar-loader-${key}`
        }

        this.refreshStyle();

        this.divs.inner.appendChild(this.divs.title);
        this.divs.inner.appendChild(this.divs.progress);
        this.divs.progress.appendChild(this.divs.progressValue)
        this.containerDiv.appendChild(this.divs.inner);

        this.divs.title.innerHTML = 'Loading..'

        document.body.append(this.containerDiv);
    }

    public refreshStyle(){
        Object.assign(this.css.container, this.customStyle?.container);
        Object.assign(this.css.inner, this.customStyle?.inner)
        Object.assign(this.css.title, this.customStyle?.title);
        Object.assign(this.css.progress, this.customStyle?.progress)
        Object.assign(this.css.progressValue, this.customStyle?.progressValue)

        Object.assign(this.containerDiv.style, this.css.container)
        Object.assign(this.divs.inner.style, this.css.inner)
        Object.assign(this.divs.title.style, this.css.title);
        Object.assign(this.divs.progress.style, this.css.progress)
        Object.assign(this.divs.progressValue.style, this.css.progressValue)
    }
}


export class DefaultLoaderUI extends UI{
    constructor(options? : {style?:LoaderStyle, onLoad?: OnLoad}) {
        super(options?.style);
        THREE.DefaultLoadingManager.onStart =  () =>{
            this.initialize();
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            options?.onLoad?.();
        };

        THREE.DefaultLoadingManager.onProgress = ( _url, itemsLoaded, itemsTotal )=> {
            this.updateLoader(itemsLoaded / itemsTotal * 100);
        };

    }
}


export class LoadingManager extends THREE.LoadingManager {
    ui = new UI(); // no multiple inheritance (╯°□°)╯︵ ┻━┻

    private onStartCallback: Function | undefined = undefined;

    constructor(options?: {style?: LoaderStyle, onLoad?: OnLoad, onProgress?: OnProgress, onError?: OnError}) {
        super(() => options?.onLoad?.(), (url, loaded, total) => {
            this.ui.customStyle = options?.style;
            this.ui.refreshStyle();

            options?.onProgress?.(url, loaded, total);
            this.ui.updateLoader(loaded / total * 100);
        }, options?.onError);
    }

    public readonly onStart = () : void  => {
        this.ui.initialize();
        if (this.onStartCallback) this.onStartCallback();
    }

    public _onStart = (callback: Function) : void => {
        this.onStartCallback = callback;
    }

    public dispose = () : void  => {
        this.ui.dispose();
    }

}
