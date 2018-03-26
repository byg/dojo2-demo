import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Button from '@dojo/widgets/button'
import global from '@dojo/shim/global';

import * as css from './styles/helloWorld.m.css';


/**
 * A "Hello World" widget that renders a spinning Dojo 2 logo and the text "Hello, Dojo 2 World!".
 *
 * Refer to the creating widgets tutorial for help: https://dojo.io/tutorials/003_creating_widgets/
 */
export class HelloWorld extends WidgetBase {
	private myModule: any;

	protected render() {
		if (this.myModule) {
			console.log(Button);
			console.log(this.myModule);
			return v('div', { classes: css.root }, [
				w(Button, {}, ['from local']),
				//not work without any error, the reason maybe there has two loader and have two context,the dojo vdom cant't recognize the myModule.
				//but then is there a right way to dynamic load modules under these circumstances?
				w(this.myModule, {}, ['from server'])
			]);
		}
		return v('div', { classes: css.root }, [
			w(Button, { onClick: this.onClick }, ['click me'])
		]);
	}

	private onClick() {
		//there i want to dynamic load another dojo widget '@dojo/widgets/mybutton' from a server(not local),
		//for test, i use `@dojo/widgets/button`.
		this.SystemJSLoad('@dojo/widgets/button/index.js');
	}

	/** dynamic load modules from a server*/
	private SystemJSLoad(moduleId: string) {
		// global.require(moduleId, (widgetCtor: any) => {})
		global.SystemJS.import(moduleId).then((widgetCtor: any) => {
			//load successfully
			this.myModule = widgetCtor.default;
			this.invalidate();
		});
	}
}

export default HelloWorld;
