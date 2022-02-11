    /*---- Global variable define -----*/
    var G_Error = "1";
    var G_Status = "0";
    var G_Error_Msg = "";
    var pwd = document.getElementBy("INPUT_Psd").value;
 
    //support language
    var G_SupportLang = "en_us";
    //default language
    var G_DefaultLang = "en_us";
 
    //Init
    //get user info
    var G_UserInfo = new Array();
    var m = 0;
    G_UserInfo[m] = new Array();
    G_UserInfo[m][0] = "admin"; //UserName
    G_UserInfo[m][2] = "1"; //Level
    G_UserInfo[m][3] = "1"; //Index
    m++;
 
 
    //加载语言列表
    function createLangsOptions() {
        var _text = [],
            _value = [];
        var split_lang = G_SupportLang.split(";");
        for (var i = 0; i < split_lang.length; i++) {
            if (split_lang[i] == 'en_us') {
                _text.push('English');
            } else if (split_lang[i] == 'zh_cn') {
                _text.push('简体中文');
            }
            _value.push(split_lang[i]);
        }
 
        $S('SELECT_Language', _text, _value);
    }
 
    function uiOnload() {
        //search language
        Cookie.Set('language', G_DefaultLang);
        chg_language(data_language);
        //create user option
        createUserOpt();
        //$('SELECT_UserName').value = '-';
        var Psd = Cookie.Get('TBSPASSWORD');
 
        if (Psd) {
            Form.Checkbox('INPUT_Remember', '1');
            $('INPUT_Psd').value = Psd;
        }
        $('INPUT_Psd').focus();
 
        dealWithError();
    }
 
    function createUserOpt() {
        var _text = [],
            _value = [];
        var formIp = '129.45.99.246';
 
        if (formIp.indexOf('192.168') > -1) {
            _text = [G_UserInfo[0][0]], _value = [G_UserInfo[0][0]];
        } else {
            _text = [G_UserInfo[0][0]], _value = [G_UserInfo[0][0]];
        }
        $S('SELECT_UserName', _text, _value);
    }
 
    function uipostLogin() {
      alert(pwd);
    }
 
    function recordPsd() {
        if (Form.Checkbox('INPUT_Remember')) { //checked = true;
            Cookie.Set('TBSPASSWORD', $('INPUT_Psd').value, 720);
        } else if (!Form.Checkbox('INPUT_Remember')) { //checked = false;
            Cookie.Delete('TBSPASSWORD');
        }
    }
 
    /* 更换main.html语言 */
    function onChgLang() {
        setCookie('language', $('SELECT_Language').value);
        document.location.href = '/cgi-bin/webproc';
    }
 
    /* 
    对错误码的处理 
    错误码的格式:节点名=错误码
    */
    function dealErrorMsg(arrayNode, errorMsg) {
        if (typeof errorMsg != 'string')
            return;
 
        //将错误信息一分为二：前段寻找错误码对应的节点；后段寻找错误码对应的提示；
        var errorFragment = errorMsg.split('=');
        var errorCode, errorString, leafNode;
 
        //寻找错误码对应的节点;
        if (errorFragment != null && errorFragment.length > 0) {
            var _fragment = errorFragment[0].split('.');
            leafNode = _fragment[_fragment.length - 1];
            leafNode = arrayNode[leafNode];
        }
 
        //在获取错误码后，立即寻找相应的错误码。
        if (errorFragment[1] != null) {
            errorCode = errorFragment[1].match(/^[0-9]{4}/)[0];
        } else {
            if (errorMsg.match(/^[0-9]{4}/) == null) {
                leafNode = arrayNode["result"];
 
                if ($(leafNode)) {
                    $(leafNode).innerHTML = errorMsg;
                }
                return false;
            }
            errorCode = errorMsg.match(/^[0-9]{4}/)[0];
        }
 
        if (UEcode[errorCode] !== undefined) {
            errorString = UEcode[errorCode];
        } else if (SEcode[errorCode] !== undefined) {
            errorString = SEcode[errorCode];
        } else {
            errorString = SEcode[1000];
        }
 
        //选择两种不同的错误提示方式：1、将错误准确打印在对应的输入框之后；2、对于未知错误，以告警框来提示；
        if (leafNode != undefined) {
            $(leafNode).innerHTML = errorString;
        } else {
            alert(errorString + "!");
        }
    }
 
    function dealWithError() {
        if (G_Error != 1) {
            return false;
        }
 
        var arrayHint = [];
 
        dealErrorMsg(arrayHint, G_Error_Msg);
    }
 
    window.onload = uiOnload;
  