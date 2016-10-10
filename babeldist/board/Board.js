import React from 'react';

export default React.createClass({
    displayName: "Board",


    pressPanel(panelId) {
        var btn = this.btns[panelId];
        console.log(btn);
        if (btn && btn.className.indexOf("pressed") == -1) {
            var origClass = btn.className;
            btn.className = origClass + " pressed";
            setTimeout(function () {
                btn.className = origClass;
            }, 300);
        }
    },

    btns: {},

    onGameCheck() {
        console.log("CHEEEEK");
    },

    start() {
        var game = new Match(this.props.panels);
        game.subscribe(Match.event.checkUserInput, this.onGameCheck);
        game.getStream();
        game.getStream();
        game.getStream();
        var newStream = game.getStream();
        console.log(newStream);
    },

    render() {
        var panels = this.props.panels;
        var _this = this;
        return React.createElement(
            "div",
            null,
            panels.map(function (p) {
                return React.createElement(
                    "div",
                    { key: p, ref: i => _this.btns[p] = i, className: "board", onClick: _this.pressPanel.bind(_this, p) },
                    p
                );
            }),
            React.createElement(
                "button",
                { onClick: this.start },
                "Start!"
            )
        );
    }

});