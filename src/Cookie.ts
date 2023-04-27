export const Cookie = {
    set: (name: string, value: string, days: number) => {
        let domain, domainParts, date, expires, host;
        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        else {
            expires = "";
        }

        host = location.host;
        if (host.split('.').length === 1) {
            document.cookie = name + "=" + value + expires + "; path=/";
        }
        else {
            domainParts = host.split('.');
            domainParts.shift();
            domain = '.' + domainParts.join('.');

            document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
            if (Cookie.get(name) == null || Cookie.get(name) != value) {
                domain = '.' + host;
                document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
            }
        }
    },
    get: (name: string) => {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    erase: (name: string) => {
        Cookie.set(name, '', -1);
    }
};