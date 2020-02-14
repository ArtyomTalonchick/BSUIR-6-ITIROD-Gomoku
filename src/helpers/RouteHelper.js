export default class RouteHelper {

    static build(route, parameters = {}) {
        let url = Object.keys(parameters)
            .reduce((resultRoute, paramKey) => {
                let preparedKey;
                const preparedKey1 = `:${paramKey}?`;
                const preparedKey2 = `:${paramKey}`;
                if (resultRoute.includes(preparedKey1)) {
                    preparedKey = preparedKey1;
                } else if (resultRoute.includes(preparedKey2)) {
                    preparedKey = preparedKey2;
                }
                return preparedKey ? resultRoute.replace(preparedKey, parameters[paramKey]) : resultRoute;
            }, route);

        return url.split('/:').reduce((result, part) =>
                result ? result + part.slice(part.includes('/') ? part.indexOf('/') : part.length) : part
            , '');
    }

    // TODO: check optional parameters
    static compare(mainRoute, checkRoute) {
        const mainParts = mainRoute.split('/');
        const checkParts = checkRoute.split('/');
        for (let i = 0; i < mainParts.length; i++) {
            if(mainParts[i].startsWith(':'))
                continue;
            if(mainParts[i] !== checkParts[i])
                return false;
        }
        return true;
    }
}
