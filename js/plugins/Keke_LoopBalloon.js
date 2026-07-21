//=============================================================================
// Keke_LoopBalloon - ループ・フキダシアイコン
// バージョン: 1.0.4
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc フキダシアイコンをループ表示させる
 * @author ケケー
 * @url https://kekeelabo.com
 * 
 * @help
 * 【ver.1.0.4】
 * フキダシアイコンをループ表示させる
 * プラグインコマンドか注釈を使って表示できる
 *
 * 
 * 【機能1】プラグインコマンドでフキダシアイコンを表示
 * => プラグインコマンド → フキダシアイコンの表示
 * 　対象キャラ・フキダシアイコンIDを入力
 * 
 * 
 * 【機能2】プラグインコマンドでフキダシアイコンを消去
 * => プラグインコマンド → フキダシアイコンの消去
 * 　対象キャラを入力
 * 
 * 
 * 【機能3】注釈でフキダシアイコンを表示
 * => イベントコマンドの『注釈』を使う
 * ★注釈の置き場所は「現在のページの一番上」か「1ページ目の一番上」
 * 　まず現在のページのがあればそれを使い、なければ1ページ目のを使う
 * 　注釈は複数つなげることも可能
 * 置いた注釈の中に
 * <balloon: フキダシアイコンID, (ループウェイト), (ループ回数)>
 * 　※ループウェイトとループ回数は省略可能
 * 例)
 * <balloon: 1>
 * 　びっくりのフキダシアイコンを表示
  * <balloon: 0>
 * 　フキダシアイコンを表示しない
 * <balloon: 2, 30, 5>
 * 　はてなのフキダシアイコンを表示
 * 　ループ間に 30フレーム のウェイトを挟み、
 * 　5回 表示したら終了
 * 
 * 
 * 【付属】標準のアイコンID
 * 1:  びっくり
 * 2:  はてな
 * 3:  音符
 * 4:  ハート
 * 5:  怒り
 * 6:  汗
 * 7:  くしゃくしゃ
 * 8:  沈黙
 * 9:  電球
 * 10: Zzz
 * 11: ユーザー定義1
 * 12: ユーザー定義2
 * 13: ユーザー定義3
 * 14: ユーザー定義4
 * 15: ユーザー定義5
 * 
 * 
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 * 
 *
 * @command フキダシアイコンの表示
 * @desc フキダシアイコンをループ表示する
 *
 * @arg 対象キャラ-名前
 * @desc 名前で対象指定。***:イベント検索、セルフ:イベント自身、プレイヤー:同、全:全キャラ、\v[***]:変数。, で複数指定
 *
 * @arg 対象キャラ-ID
 * @desc IDで対象指定。。1〜:イベントID。0:イベント自身、-1:プレイヤー、-2:全キャラ、\v[***]:変数, で複数、~ でまとめて指定
 * 
 * @arg フキダシアイコンID
 * @desc ループ表示するフキダシアイコンのID
 * @type number
 * 
 * @arg ループウェイト
 * @desc ループの間に挟むウェイト。5 なら 5フレーム。0~5 なら 0 から 5 の間でランダム 
 * 
 * @arg ループ回数
 * @desc ループ表示する回数。5 なら 5回 表示。0~5 なら 0 から 5 の間でランダム。空欄なら無制限
 * 
 * 
 * 
 * @command フキダシアイコンの消去
 * @desc 表示中のフキダシアイコンを消去する
 *
 * @arg 対象キャラ-名前
 * @desc 名前で対象指定。***:イベント検索、セルフ:イベント自身、プレイヤー:同、全:全キャラ、\v[***]:変数。, で複数指定
 *
 * @arg 対象キャラ-ID
 * @desc IDで対象指定。。1〜:イベントID。0:イベント自身、-1:プレイヤー、-2:全キャラ、\v[***]:変数, で複数、~ でまとめて指定
 */
 
 
 
(() => {
    //- プラグイン名
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
    
    
    
    //==================================================
    //--  プラグインコマンド
    //==================================================
    
    //- フキダシアイコンの表示
    PluginManager.registerCommand(pluginName, "フキダシアイコンの表示", args => {
        // バルーンIDを取得
        const balloonId = Number(convertVariable(args["フキダシアイコンID"]));
        if (!balloonId) { return; }
        // 対象キャラを取得
        const names = convertVariable(args["対象キャラ-名前"]);
        const ids = convertVariable(args["対象キャラ-ID"]);
        const charas = [...getCharasByName(names), ...getCharasById(ids)];
        if (!charas || !charas.length) { return; }
        // 各パラメータを取得
        const loopWait = convertVariable(args["ループウェイト"]);
        const loopNum = randomise(convertVariable(args["ループ回数"]));
        // ループバルーンをセット
        charas.forEach(chara => {
            // バルーンスプライトの消去
            delBalloonSprite(chara);
            chara._loopBalloonKe = { id:balloonId, wait:loopWait, num:loopNum };
        })
    });


    //- フキダシアイコンの消去
    PluginManager.registerCommand(pluginName, "フキダシアイコンの消去", args => {
        // 対象キャラを取得
        const names = convertVariable(args["対象キャラ-名前"]);
        const ids = convertVariable(args["対象キャラ-ID"]);
        const charas = [...getCharasByName(names), ...getCharasById(ids)];
        if (!charas || !charas.length) { return; }
        // ループバルーンを消去
        charas.forEach(chara => {
            // バルーンスプライトの消去
            delBalloonSprite(chara);
            chara._loopBalloonKe = null;
        })
    });
    
    
    
    //==================================================
    //--  ループバルーン
    //==================================================
    
    //- ゲームキャラクターベース・更新(コア追加)
    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBase_update.apply(this);
        // ループバルーンの更新
        updateLoopBalloon(this);
    };


    //- ループバルーンの更新
    function updateLoopBalloon(chara) {
        // 注釈からのバルーン取得
        getBalloonByComment(chara);
        const balloon = chara._loopBalloonKe || chara._loopBallonCommentKe;
        // バルーンデータがなければリターン
        if (!balloon) { return; }
        // バルーン表示中はリターン
        if (chara._balloonPlaying) { return; }
        // ウェイトを適用
        if (balloon.waitDura) {
            balloon.waitDura--;
            return;
        }
        // バルーンを表示
        $gameTemp.requestBalloon(chara, balloon.id);
        // ウェイトをセット
        balloon.waitDura = randomise(balloon.wait);
    };


    //- 注釈からのバルーン取得
    function getBalloonByComment(event) {
        // イベント以外はリターン
        if (!event._eventId) { return; }
        // 前回のバルーンを保存
        const preBalloon = event._loopBallonCommentKe;
        // ページ切り替わったら初期化
        initAtPageChange(event);
        // すでに取得済みならリターン
        if (event._loopBallonCommentKe) { return; }
        // 最初の注釈を取得
        const comment = getFirstComment(event);
        if (!comment) { return null; }
        const p = getParameter(comment);
        if (p) {
            event._loopBallonCommentKe = p;
        }
        // バルーンが変更されたら
        if (preBalloon && preBalloon.id != p.id) {
            // バルーンスプライトの消去
            delBalloonSprite(event);
        }
    };


    //- ページが切り替わったら初期化
    function initAtPageChange(event) {
        // ページが切り替わったら
        if (event._currentPageKeLpbl != event._pageIndex) {
            // パラムスを初期化
            event._loopBallonCommentKe = null;
        }
        // 現在のページを保存
        event._currentPageKeLpbl = event._pageIndex;
    };


    //- パラメータの取得
    function getParameter(note = "") {
        // ノートから設定部分を検索
        let desc = "";
        if (note) {
            let match = note.match((/<balloon:\s*([^>]+)>/i));
            if (!match || !match[1]) { return null; }
            desc = match[1];
        }
        // パラメータを取得
        const descs = desc.replace(/\s/g, "").split(",");
        const p = {};
        p.id = Number(descs[0]);
        p.wait = descs[1];
        p.num = randomise(descs[2]);
        return p;
    };


    //- ゲームキャラクターベース・バルーンの終了(コア追加)
    const _Game_CharacterBase_endBalloon = Game_CharacterBase.prototype.endBalloon;
    Game_CharacterBase.prototype.endBalloon = function() {
        _Game_CharacterBase_endBalloon.apply(this);
        // バルーンの回数カウント
        countBalloonNum(this);
    };


    //- バルーンの回数カウント
    function countBalloonNum(chara) {
        const balloon = chara._loopBalloonKe;
        if (!balloon || !balloon.num) { return; }
        balloon.num--;
        // 終了
        if (balloon.num <= 0) {
            chara._loopBalloonKe = null;
        }
    };


    //- バルーンスプライトの消去
    function delBalloonSprite(chara) {
        const spriteset = SceneManager._scene._spriteset;
        const balloons = spriteset._balloonSprites;
        if (!balloons || !balloons.length) { return; }
        balloons.forEach(balloon => {
            if (balloon.targetObject == chara) {
                spriteset.removeBalloon(balloon);
            }
        });
    };

    
    
    //==================================================
    //--  プラグインコマンド基本 /ベーシック
    //==================================================
    
    let plcmPreter = null;
    

    //- プラグインコマンド呼び出しプリターを保存(コア追加)
    const _PluginManager_callCommand = PluginManager.callCommand;
    PluginManager.callCommand = function(self, pluginName, commandName, args) {
        plcmPreter = self;
        _PluginManager_callCommand.apply(this, arguments);
        plcmPreter = null;
    };
    
    
    //- プラグインコマンド呼び出しイベントを取得
    function getPlcmEvent() {
        return getPreterEvent(plcmPreter);
    };


    //- インタープリターのイベント取得
    function getPreterEvent(preter) {
        if (!preter) { return null; }
        return preter.character(preter.eventId());
    };
    
    
    //- 名前でのキャラリスト取得
    function getCharasByName(names, self) {
        if (!names) { return []; }
        const nameList = names.replace(/\s/g, "").split(",");
        let charas = [];
        let match = null;
        for (const name of nameList) {
            // イベントを取得
            $gameMap.events().forEach(event => {
                const note = event.event().name + " " + event.event().note;
                if (note.includes(name)) { charas.push(event); }
            });
            // セルフを取得
            if (name.match(/^(セルフ|自分|自身|self)$/)) {
                self = self || getPlcmEvent() || (charaSpritePlcm ? charaSpritePlcm._character : null) || $gamePlayer;
                if (self) { charas.push(self); }
            }
            // プレイヤーを取得
            if (name.match(/^(プレイヤー|操作キャラ|player)$/)) {
                charas = [...charas, $gamePlayer];
            }
            // フォロワーを取得
            match = name.match(/^(フォロワー|フォロアー|隊列|隊列キャラ|follower)(\d*)$/)
            if (match) {
                const id = match[2] ? Number(match[2]) - 1 : 0;
                charas = id != null ? [...charas, $gamePlayer._followers._data[id]] : [...charas, ...$gamePlayer._followers._data];
            }
            // パーティを取得
            if (name.match(/^(パーティ|味方|味方全員|味方全体|party)$/)) {
                charas = [...charas, $gamePlayer, ...$gamePlayer._followers._data];
            }
            // 乗り物を取得
            match = name.match(/^(乗り物|乗物|乗機|vehicle)(\d*)$/);
            if (match) {
                const id = match[2] ? Number(match[2]) - 1 : 0;
                charas = id ? [...charas, $gameMap._vehicles[id]] : [...charas, ...$gameMap._vehicles];
            }
            // 全て取得
            if (name.match(/^(全て|すべて|全部|全体|all)$/)) {
                charas = [...$gameMap.events(), $gamePlayer, ...$gamePlayer._followers._data, ...$gameMap._vehicles];
            }
            // 選択なし
            if (name.match(/^(なし|無し|none)$/)) {
            }
        }
        charas = charas.filter(chara => chara);
        return charas;
    };
    
    
    //- IDでのキャラリスト取得
    function getCharasById(ids, self) {
        if (!ids) { return []; }
        const idList = !ids ? [] : strToNumList(ids.toString());
        let charas = [];
        for (const id of idList) {
            // イベントを取得
            if (id > 0) { charas.push($gameMap.event(id)); }
            // セルフを取得
            if (id == 0) {
                self = self || getPlcmEvent() || (charaSpritePlcm ?charaSpritePlcm._character : null) || $gamePlayer;
                if (self && !idList.includes(self._eventId)) { charas.push(self); }
            }
            // プレイヤーを取得
            if (id == -1) { charas = [...charas, $gamePlayer]; }
            // フォロワーを取得
            if (id <= -10 && id >= -99) {
                charas = id == -10 ? [...charas, ...$gamePlayer._followers._data] : [...charas, $gamePlayer._followers._data[Math.abs(id) - 11]];
            }
            // 乗り物を取得
            if (id <= -100) {
                charas = id == -100 ? [...charas, ...$gameMap._vehicles] : [...charas, $gameMap._vehicles[Math.abs(id) - 101]];
            }
            // 全て取得
            if (id == -2) {
                charas = [...$gameMap.events(), $gamePlayer, ...$gamePlayer._followers._data, ...$gameMap._vehicles];
            }
        }
        charas = charas.filter(chara => chara);
        return charas;
    };



    //==================================================
    //-  その他 /ベーシック
    //==================================================

    //- 最初の注釈を取得
    function getFirstComment(event) {
        let page = event.page();
        let list = page ? event.page().list : [];
        let commandFirst = list[0] || {};
        if (commandFirst.code != 108) {
            page = event.event().pages[0];
            list = page ? page.list : [];
            commandFirst = list[0] || {};
            if (commandFirst.code != 108) { return; }
        }
        // 注釈を全て読み込み
        let comment = "";
        let i = 0;
        while (true) {
            const command = list[i];
            if (!command || !(command.code == 108 || command.code == 408)) { break; }
            comment += command.parameters[0] + "\n";
            i++;
        }
        return comment;
    };


    //- 変数の置換
    function convertVariable(str) {
        if (!str) { return str; }
        const regExp = /[\x1b\\]v\[(\d+)\]/gi;
        while (true) {
            const match = regExp.exec(str);
            if (!match) { break; }
            const val = $gameVariables.value(Number(match[1]));
            str = str.replace(match[0], val);
        }
        return str;
    };


    //- ランダマイズ
    function randomise(val) {
        if (typeof val != "string" || !val.includes("~")) { return val; }
        const vals = val.replace(/\s/g, "").split("~");
        const calcs = [Number(vals[0]), Number(vals[1])];
        calcs.sort((a, b) => a - b);
        return Math.round(calcs[0] + Math.random() * (calcs[1] - calcs[0]));
    };


    //- スプライトの検索-キャラクター
    function searchSpriteChara(chara) {
        let result = null;
        const sprites = SceneManager._scene._spriteset._characterSprites;
        for (let sprite of sprites) {
            if (isSameChara(sprite._character, chara)) {
                result = sprite;
                break;
            }
        }
        return result;
    };

})();