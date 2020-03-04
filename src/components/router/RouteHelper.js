export default class RouteHelper {
    static instances = [];
    static registerRoute = route => this.instances.push(route);
    static unregisterRoute = route => this.instances.splice(this.instances.indexOf(route), 1);

    static getUrlWithParameters = (path, parameters) => {
        const parameters_string = parameters &&
            Object.entries(parameters)
                .map(([name, value]) => `${name}=${value.toString()}`)
                .join('&');
        return path + (parameters_string ? `?${parameters_string}` : '');
    };

    static historyReplace = (path, parameters, state) => {
        history.replaceState(state || {}, null, this.getUrlWithParameters(path, parameters));
        this.instances.forEach(instance => instance.onUrlUpdate())
    };

    static historyPush = (path, parameters, state) => {
        history.pushState(state || {}, null, this.getUrlWithParameters(path, parameters));
        this.instances.forEach(instance => instance.onUrlUpdate());
    };

    static getParameterFromLocation = name => new URL(location.href).searchParams.get(name);
}
