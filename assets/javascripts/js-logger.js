const logger = {
    debug: false,
    user: null,
    localStorageKey: "JSLOG-STORE",
    API_URL: "https://data.pheromones.io/",
    data: [],
    init: function() {
        if (!localStorage || localStorage.getItem(logger.localStorageKey) !== null) {
            logger.data = JSON.parse(localStorage.getItem(logger.localStorageKey));
        }

        logger.bindElements();

        logger.log("LOAD");
        
        $(window).on('beforeunload', function() {
          logger.log("CLOSE");
          logger.submit(true);
        });
    },
    setUser: function(user) {
        logger.user = user;
    },
    setApiUrl: function(url) {
        logger.API_URL = url;
    },
    bindElements: function() {
        $.each($("a, button"), function() {
            $(this).click(function() {
                logger.log("CLICK", $(this));
            });
        });

        $.each($("select, textarea, input"), function() {
            $(this).change(function() {
                logger.log("CHANGE", $(this));
            });
            $(this).click(function() {
                logger.log("CLICK", $(this));
            });
        });
    },
    log: function(type, target) {
        var data = {
            type: type,
            page: $(location).attr("href"),
            time: $.now(),
            user: logger.user
        };

        if (target) {
            data.path = logger.fn.fullPath(target);
            data.element = logger.fn.elementData(target);
        }

        logger.data.push(data);

        if(logger.debug) {
            console.log(logger.data);
        }

        localStorage.setItem(logger.localStorageKey, JSON.stringify(logger.data));

        logger.submit();
    },
    submit: function(attemptForce) {
        if (logger.data.length < 5 && !attemptForce) {
            return;
        }

        var dataToSubmit = JSON.stringify(logger.data);
        if (!dataToSubmit) {
            return;
        }
        logger.data = [];

        $.post(logger.API_URL + "snapshots.json", {
            list: dataToSubmit,
            async: attemptForce
        }).done(function(data) {
        }).fail(function(details) {
            if (details.status === 200
                    && details.statusText === "OK"
                    && details.responseText === "{success:true}") {
                return;
            }

            logger.data = logger.data.concat(JSON.parse(dataToSubmit));
        });
    },
    fn: {
        elementData: function(el) {
            var data = {};

            data.tag = el.prop("tagName");

            var attributesToCollect = ["class", "id", "name", "href", "data-key", "data-hash"];
            for (var i = 0; i < attributesToCollect.length; i++) {
                var attrKey = attributesToCollect[i];
                if (el.attr(attrKey)) {
                    data[attrKey] = el.attr(attrKey);
                }
            }

            if (el.val()) {
                data.value = el.val();
            }

            if (el.text() && el.prop("tagName").toUpperCase() === "A") {
                data.text = el.text();
            }

            for (var c = 1, e = el[0]; e.previousElementSibling; e = e.previousElementSibling, c++)
                ;
            data.nthChild = c;

            return data;
        },
        fullPath: function(el) {
            var names = [];
            while (el[0].parentNode) {
                names.unshift(logger.fn.elementData(el));
                el = el.parent();
            }

            for (var i = 1; i <= names.length; i++) {
                names[i - 1].depth = i;
            }

            return names;
        }
    }
};

export default logger;
