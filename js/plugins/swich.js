//=============================================================================
// switchONatNewGame.js
//=============================================================================

/*:
 * @plugindesc switch on when newgame selected. 
 * @author @sirloin_ryo
 *
 * @param switchNo
 * @desc The value of the switch No. (over 0)
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc ゲーム起動時、特定のスイッチをオンにします。自動実行コモンのトリガーにどうぞ。
 * @author @sirloin_ryo
 *
 * @param switchNo
 * @desc オンにしたいスイッチの番号 (0以上)
 * @default 0
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {
    var parameters = PluginManager.parameters('switchONatNewGame');
    var switchNo = Number(parameters['switchNo'] || 0);
    var _DataManager_setupNewGame = DataManager.setupNewGame;
   DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
       $gameSwitches.setValue(switchNo,true);
    };
})();
