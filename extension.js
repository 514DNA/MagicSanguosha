game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"东方project",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "铃仙":["female","wei",4,["幻视","狂气"],["des:狂气的月兔"]],
            "蕾米莉亚":["female","shu",4,["红魔","命运","神枪"],["zhu","des:永远的鲜红之幼月"]],
            "芙兰朵露":["female","shu",4,["破碎","四重"],["des:最终鬼畜妹"]],
            "东风谷早苗":["female","wu",3,["奇迹","祈愿","风祝"],["des:幻想乡的现人神"]],
            "藤原妹红":["female","wei",4,["蓬莱","天翔","灭罪"],["des:不老不死的人类"]],
            "蓬莱山辉夜":["female","wei",3,["神宝","难题"],["zhu","des:永远与须臾的罪人"]],
            "古明地恋":["female","shu",3,["本我","超我","埋火"],["des:紧闭的恋之瞳"]],
            "古明地觉":["female","shu",3,["读心","催眠"],["zhu","des:第三只眼"]],
            "雾雨魔理沙":["female","qun",3,["天仪","魔炮","彗星"],["des:普通的魔法使"]],
            "爱丽丝":["female","qun",3,["文乐"],["des:七色的魔法使"]],
            "十六夜咲夜":["female","shu",4,["飞刀","幻世"],["des:完美潇洒的女仆"]],
            "魂魄妖梦":["female","qun",4,["六根","业风"],["des:白玉楼的庭师"]],
            "上白泽慧音":["female","wei",3,["净化","旧史","新史"],["des:一本正经的历史家"]],
            "西行寺幽幽子":["female","qun",3,[],["zhu","des:华胥的亡灵"]],
        },
        translate:{
            "铃仙":"铃仙",
            "蕾米莉亚":"蕾米莉亚",
            "芙兰朵露":"芙兰朵露",
            "东风谷早苗":"东风谷早苗",
            "藤原妹红":"藤原妹红",
            "蓬莱山辉夜":"蓬莱山辉夜",
            "古明地恋":"古明地恋",
            "古明地觉":"古明地觉",
            "雾雨魔理沙":"雾雨魔理沙",
            "爱丽丝":"爱丽丝",
            "十六夜咲夜":"十六夜咲夜",
            "魂魄妖梦":"魂魄妖梦",
            "上白泽慧音":"上白泽慧音",
            "西行寺幽幽子":"西行寺幽幽子",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            "幻视":{
                trigger:{
                    target:"useCardToBefore",
                },
                filter:function (event,player){
                    return (event.card.name == 'sha' || (get.type(event.card) == 'trick'  && event.cards[0] && event.cards[0] == event.card));
                },
                content:function (){
                     player.draw(player.hp);
                     player.chooseToDiscard(player.hp,true,'hej');
                },
            },
            "狂气":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                filter:function (event,player){
                return (event.source&&event.source.countCards('hej')&&event.source!=player);
             },
                content:function (){
                 player.discardPlayerCard(get.prompt('狂气',trigger.source),trigger.source,get.buttonValue,'hej').set('logSkill',['狂气',trigger.source]);
                 player.draw(1);
             },
            },
            "红魔":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
                    return (player.isDamaged());
                },
                content:function (){
                    player.recover(trigger.num);
                },
            },
            "命运":{
                trigger:{
                    global:"judge",
                },
                filter:function (event,player){
                    return player.countCards('h',{color:'red'})>0;
                },
                direct:true,
                content:function (){
                    "step 0"
                    player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
                    get.translation(trigger.player.judging[0])+'，'+get.prompt('命运'),'h',function(card){
                        return get.color(card)=='red';
                    }).set('ai',function(card){
                        var trigger=_status.event.getTrigger();
                        var player=_status.event.player;
                        var judging=_status.event.judging;
                        var result=trigger.judge(card)-trigger.judge(judging);
                        var attitude=get.attitude(player,trigger.player);
                        if(attitude==0||result==0) return 0;
                        if(attitude>0){
                            return result;
                        }
                        else{
                            return -result;
                        }
                    }).set('judging',trigger.player.judging[0]);
                    "step 1"
                    if(result.bool){
                        player.respond(result.cards,'highlight');
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(result.bool){
                        player.logSkill('命运');
                        player.$gain2(trigger.player.judging[0]);
                        player.gain(trigger.player.judging[0]);
                        trigger.player.judging[0]=result.cards[0];
                        if(!get.owner(result.cards[0],'judge')){
                            trigger.position.appendChild(result.cards[0]);
                        }
                        game.log(trigger.player,'的判定牌改为',result.cards[0]);
                    }
                    "step 3"
                    game.delay(2);
                },
                ai:{
                    tag:{
                        rejudge:1,
                    },
                },
            },
            "神枪":{
                enable:"phaseUse",
                position:"he",
                filterCard:function (card){
                    return get.subtype(card)=='equip1';
                },
                filterTarget:function (card,player,target){
                    if(player==target) return false;
                    return true;
                },
                content:function (){
                    target.damage();
                },
                ai:{
                    damage:true,
                    order:8,
                    result:{
                        target:function (player,target){
                            return get.damageEffect(target,player);
                        },
                    },
                },
            },
            "破碎":{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
                    return player.countCards('he')>0;
                },
                content:function (){
                    player.chooseToDiscard(1,true,'he');
                    trigger.num++;
                },
                ai:{
                    damageBonus:true,
                },
            },
            "四重":{
                trigger:{
                    player:"phaseDiscardBefore",
                },
                frequent:true,
                content:function (){
                    player.draw(2);
                },
            },
            "奇迹":{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"h",
                selectCard:1,
                filter:function (event,player){
                    return player.countCards('h')>0;
                },
                filterTarget:function (card,player,target){
                    return true;
                },
                content:function (){
                    "step 0"
                    player.judge(function(card){
                        if(get.color(card)=='red') 
                        {
                            return 1;   
                        }
                        else
                        {
                            return 2;
                        }            
                    })
                    "step 1"
                    if(result.judge==2){
                        target.draw(2);
                    }
                    else{
                        if(target.isDamaged())
                            target.recover(1);
                    }
                },
            },
            "祈愿":{
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (event,player){
                    return ((event.player.countCards('j')>0) && player.countCards('h')>0);
                },
                content:function (){
                    "step 0"
                    player.chooseToDiscard(1,true,'h');
                    player.gain(trigger.player.getCards('j'),trigger.player);
                    trigger.player.$give(trigger.player.countCards('j'),player);
                    "step 1"
                    player.judge(function(card){
                        if(get.color(card)=='red') 
                        {
                            return 1;   
                        }
                        else
                        {
                            return 2;
                        }            
                    })
                    "step 2"
                    if(result.judge==2){
                        trigger.player.draw(2);
                    }
                    else{
                        if(trigger.player.isDamaged())
                            trigger.player.recover(1);
                    }
                },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                            return 5;
                        },
                    },
                    threaten:2,
                },
            },
            "奇迹2":{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"h",
                selectCard:1,
                filter:function (event,player){
                    return player.countCards('h')>0;
                },
                filterTarget:function (card,player,target){
                    return true;
                },
                content:function (){
                    "step 0"
                    player.judge(function(card){
                        if(get.color(card)=='red') 
                        {
                            return 1;   
                        }
                        else
                        {
                            return 2;
                        }            
                    })
                    "step 1"
                    if(result.judge==2){
                        target.draw(2);
                        player.draw(2);
                    }
                    else{
                        if(target.isDamaged())
                            target.recover(1);
                        if(player.isDamaged())
                            player.recover(1);
                    }
                },
            },
            "风祝":{
                skillAnimation:true,
                unique:true,
                priority:-10,
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){
                    return player.hp==1;
                },
                content:function (){
                    player.maxHp++;
                    player.update();
                    player.hp=player.maxHp;
                    player.draw(4);
                    player.addSkill('奇迹2');
                    player.removeSkill('风祝');
                    player.removeSkill('奇迹');
                },
            },
            "蓬莱":{
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (event,player){
                    return (player.isDamaged());
                },
                content:function (){
                    "step 0"
                    player.judge(function(card){
                        if(get.color(card)=='red') 
                        {
                            return 1;   
                        }
                        else
                        {
                            return -1;
                        }            
                    })
                    "step 1"
                    if(result.judge==1){
                        if(trigger.player.isDamaged())
                            trigger.player.recover(1);
                    }
                },
            },
            "天翔":{
                group:["天翔1","天翔2"],
            },
            "天翔1":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
                    if(event.nature=='fire' && event.target!=player) 
                        return true;
                    else
                        return false;
                },
                content:function (){
                    trigger.num++;
                },
            },
            "天翔2":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event){
                    if(event.nature=='fire') 
                        return true;
                    else
                        return false;
                },
                content:function (){
                    trigger.cancel();
                },
            },
            "灭罪":{
                enable:"phaseUse",
                position:"h",
                usable:1,
                selectCard:2,
                filterCard:function (card){
                    return get.color(card)=='red';
                },
                filterTarget:function (card,player,target){
                    if(player==target) return false;
                    return true;
                },
                content:function (){
                    target.damage(1,'fire');
                },
                ai:{
                    damage:true,
                    order:8,
                    result:{
                        target:function (player,target){
                            return get.damageEffect(target,player);
                        },
                    },
                },
            },
            "神宝":{
                unique:true,
                trigger:{
                    global:"gameDrawAfter",
                    player:"phaseBegin",
                },
                forced:true,
                check:function (event,player){
                    return player.hp<=1;
                },
                filter:function (event,player){
                    return !player.storage.shenbao;
                },
                content:function (){
                    "step 0"
                    player.gain(get.cards(5))._triggered=null;
                    "step 1"
                    if(player==game.me){
                        game.addVideo('delay',null);
                    }
                    player.chooseCard('选择五张牌作为神宝',5,true).ai=function(card){
                        return get.value(card);
                    };
                    "step 2"
                    player.lose(result.cards,ui.special)._triggered=null;
                    player.storage.shenbao=result.cards;
                    game.addVideo('storage',player,['神宝',get.cardsInfo(player.storage.shenbao),'cards']);
                },
                mark:true,
                intro:{
                    mark:function (dialog,content,player){
                        if(content&&content.length){
                            if(player==game.me||player.isUnderControl()){
                                dialog.addAuto(content);
                            }
                            else{
                                return '共有'+get.cnNumber(content.length)+'张星';
                            }
                        }
                    },
                    content:function (content,player){
                        if(content&&content.length){
                            if(player==game.me||player.isUnderControl()){
                                return get.translation(content);
                            }
                            return '共有'+get.cnNumber(content.length)+'神宝';
                        }
                    },
                },
                group:["神宝2"],
            },
            "神宝2":{
                trigger:{
                    player:"phaseDrawAfter",
                },
                direct:true,
                filter:function (event,player){
                    return player.storage.shenbao&&player.storage.shenbao.length;
                },
                content:function (){
                    "step 0"
                    player.chooseCard('选择任意张手牌与“神宝”交换',[1,Math.min(player.countCards('h'),player.storage.shenbao.length)]).ai=function(card){
                        var val=get.value(card);
                        if(val<0) return 10;
                        if(player.skipList.contains('phaseUse')){
                            return val;
                        }
                        return -val;
                    };
                    "step 1"
                    if(result.bool){
                        player.logSkill('神宝');
                        player.lose(result.cards,ui.special)._triggered=null;
                        player.storage.shenbao=player.storage.shenbao.concat(result.cards);
                        player.syncStorage('神宝');
                        event.num=result.cards.length;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    player.chooseCardButton(player.storage.shenbao,'选择'+event.num+'张牌作为手牌',event.num,true).ai=function(button){
                        var val=get.value(button.link);
                        if(val<0) return -10;
                        if(player.skipList.contains('phaseUse')){
                            return -val;
                        }
                        return val;
                    }
                    if(player==game.me&&!event.isMine()){
                        game.delay(0.5);
                    }
                    "step 3"
                    player.gain(result.links)._triggered=null;
                    for(var i=0;i<result.links.length;i++){
                        player.storage.shenbao.remove(result.links[i]);
                    }
                    player.syncStorage('神宝');
                    if(player==game.me&&_status.auto){
                        game.delay(0.5);
                    }
                },
            },
            "难题":{
                group:["龙玉","佛石","火盾","命泉","玉枝"],
            },
            "龙玉":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.storage.shenbao.length == 5;
                },
                content:function (){
                    "step 0"
                        event.targets=game.filterPlayer();
                        event.targets.remove(player);
                        event.targets.sort(lib.sort.seat);
                        event.targets2=event.targets.slice(0);
                        player.line(event.targets,'green');
                    "step 1"
                        if(event.targets.length){
                            event.targets.shift().damage();
                            event.redo();
                        }
                    "step 2"
                        if(event.targets2.length){
                            var cur=event.targets2.shift();
                            event.redo();
                        }
                    "step 3"
                        player.addSkill('难题2');
                        player.addSkill('龙玉2');
                },
            },
            "龙玉2":{
                audio:"ext:东方project:true",
                trigger:{
                    player:"phaseDrawBegin",
                },
                filter:function (event,player){
                    return player.hp<player.maxHp;
                },
                forced:true,
                content:function (){
                    trigger.num=2+player.maxHp-player.hp;
                },
            },
            "佛石":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.storage.shenbao.length == 4;
                },
                filterTarget:function (card,player,target){
                    if(player==target) 
                        return false;
                    return true;
                },
                content:function (){
                        target.damage(2);
                        player.addSkill('难题2');
                        player.addSkill('佛石2');
                },
            },
            "佛石2":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
                    if( event.player!=player && event.player.countCards('he')) 
                         return true;
                    else
                        return false;
                },
                content:function (){
                    trigger.player.chooseToDiscard('he',true,1);
                },
            },
            "火盾":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.storage.shenbao.length == 3;
                },
                content:function (){
                        player.draw(5);
                        player.addSkill('火盾2');
                        player.addSkill('难题2');
                },
            },
            "火盾2":{
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
                    return (event.source!=undefined && event.source!=player);
                },
                check:function (event,player){
                    return ((get.attitude(player,event.source)<=0) && (event.source != player));
                },
                logTarget:"source",
                content:function (){
                        trigger.source.damage(1,'fire');
                },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function (card,player,target){
                            if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                            return 0.8;
                        },
                    },
                },
            },
            "命泉":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.storage.shenbao.length == 2;
                },
                filterTarget:function (card,player,target){
                    return true;
                },
                content:function (){
                        target.recover(target.maxHp);
                        player.recover(player.maxHp);
                        target.draw(target.maxHp-target.countCards('h'));
                        player.draw(player.maxHp-player.countCards('h'));
                        player.addSkill('命泉2');
                        player.addSkill('难题2');
                },
            },
            "命泉2":{
                trigger:{
                    player:"changeHp",
                },
                filter:function (event,player){
                    return (event.num>0 && event.skill!="命泉2");
                },
                forced:true,
                content:function (){
                    if(player.isDamaged())
                        player.recover(1);
                },
            },
            "玉枝":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.storage.shenbao.length == 1;
                },
                content:function (){
                    "step 0"
                        event.targets=game.filterPlayer();
                        event.targets.remove(player);
                        event.targets.sort(lib.sort.seat);
                        player.line(event.targets,'green');
                    "step 1"
                        if(event.targets.length){
                            event.targets.shift().damage(2);
                            event.redo();
                        }
                    "step 2"
                        player.addSkill('难题2');
                        player.addSkill('玉枝2');
                },
            },
            "玉枝2":{
                mod:{
                    maxHandcard:function (player,num){
                        return player.maxHp;
                    },
                },
            },
            "难题2":{
                trigger:{
                    player:"phaseDiscardBegin",
                },
                forced:true,
                content:function (){
                    "step 0"
                        if(player.storage.shenbao.length == 5)
                            player.chooseCardButton('神宝·龙颈之玉',1,player.storage.shenbao,true);
                        if(player.storage.shenbao.length == 4)
                            player.chooseCardButton('神宝·佛御石之钵',1,player.storage.shenbao,true);
                        if(player.storage.shenbao.length == 3)
                            player.chooseCardButton('神宝·火蜥蜴之盾',1,player.storage.shenbao,true);
                        if(player.storage.shenbao.length == 2)
                            player.chooseCardButton('神宝·无尽的生命之泉',1,player.storage.shenbao,true);
                        if(player.storage.shenbao.length == 1)
                            player.chooseCardButton('神宝·蓬莱的玉枝',1,player.storage.shenbao,true);
                    "step 1"
                        player.storage.shenbao.remove(result.links[0]);
                        player.discard(result.links);
                        player.removeSkill('难题2');
                },
            },
            "读心":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
                    return target!=player&&target.countCards('h');
                },
                content:function (){
                    "step 0"
                    event.videoId=lib.status.videoId++;
                    var cards=target.getCards('h');
                    if(player.isOnline2()){
                        player.send(function(cards,id){
                            ui.create.dialog('想起·恐怖的记忆',cards).videoId=id;
                        },cards,event.videoId);
                    }
                    event.dialog=ui.create.dialog('想起·恐怖的记忆',cards);
                    event.dialog.videoId=event.videoId;
                    if(!event.isMine()){
                        event.dialog.style.display='none';
                    }
                    player.chooseButton().set('filterButton',function(button){
                        return true;
                    }).set('dialog',event.videoId);
                    "step 1"
                    if(result.bool){
                        event.card=result.links[0];
                        var func=function(card,id){
                            var dialog=get.idDialog(id);
                            if(dialog){
                                for(var i=0;i<dialog.buttons.length;i++){
                                    if(dialog.buttons[i].link==card){
                                        dialog.buttons[i].classList.add('selectedx');
                                    }
                                    else{
                                        dialog.buttons[i].classList.add('unselectable');
                                    }
                                }
                            }
                        }
                        if(player.isOnline2()){
                            player.send(func,event.card,event.videoId);
                        }
                        else if(event.isMine()){
                            func(event.card,event.videoId);
                        }
                    }
                    else{
                        if(player.isOnline2()){
                            player.send('closeDialog',event.videoId);
                        }
                        event.dialog.close();
                        event.finish();
                    }
                    "step 2"
                    if(player.isOnline2()){
                        player.send('closeDialog',event.videoId);
                    }
                    event.dialog.close();
                    var card=event.card;
                    player.gain(card);
                    player.$gain2(card);
                    event.finish();
                },
                ai:{
                    threaten:1.5,
                    result:{
                        target:function (player,target){
                            return -target.countCards('h');
                        },
                    },
                    order:10,
                    expose:0.4,
                },
            },
            "催眠":{
                enable:"phaseUse",
                position:"h",
                selectCard:1,
                filterCard:function (card){
                    return get.suit(card)=='heart';
                },
                filterTarget:function (card,player,target){
                    if(player==target) return false;
                    return true;
                },
                content:function (){
                    target.turnOver();
                },
            },
            "本我":{
                audio:"ext:东方project:true",
                trigger:{
                    player:"phaseEnd",
                },
                filter:function (event,player){
                    return ((player.countCards('h',{color:'black'}))>0);
                },
                content:function (){
                    "step 0"
                    player.chooseCardTarget({
                        filterCard:function(card,player){
                            return get.color(card)=='black'&&lib.filter.cardDiscardable(card,player);
                        },
                        filterTarget:function(card,player,target){
                            return player!=target;
                        },
                        ai1:function(card){
                            return 10-get.value(card);
                        },
                        ai2:function(target){
                            var att=get.attitude(_status.event.player,target);
                            var trigger=_status.event.getTrigger();
                            var da=0;
                            if(_status.event.player.hp==1){
                                da=10;
                            }
                            if(trigger.num>1){
                                if(target.maxHp>5&&target.hp>1) return -att/10+da;
                                return -att+da;
                            }
                            var eff=get.damageEffect(target,trigger.source,target,trigger.nature);
                            if(att==0) return 0.1+da;
                            if(eff>=0&&trigger.num==1){
                                return att+da;
                            }
                            if(target.hp==target.maxHp) return -att+da;
                            if(target.hp==1){
                                if(!target.hasSkillTag('maixie')){
                                        return -att+da;
                                }
                                return da;
                            }
                            if(target.hp==target.maxHp-1){
                                if(target.hasSkillTag('maixie')) return att/5+da;
                                if(att>0) return 0.02+da;
                                return 0.05+da;
                            }
                            return att/2+da;
                        },
                        prompt:get.prompt('本我')
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill(event.name,result.targets);
                        player.discard(result.cards[0]);
                        result.targets[0].damage(1+player.maxHp-player.hp);
                        player.turnOver();
                    }
                    else{
                        event.finish();
                    }
                },
                ai:{
                    damage:true,
                    order:8,
                    result:{
                        target:function (player,target){
                            return get.damageEffect(target,player);
                        },
                    },
                },
            },
            "超我":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
                    return player.isTurnedOver();
                },
                content:function (){
                    trigger.cancel();
                },
            },
            "埋火":{
                enable:"phaseUse",
                position:"h",
                selectCard:1,
                filterCard:function (card){
                    return get.suit(card)=='heart';
                },
                filterTarget:function (card,player,target){
                    if(player==target) return false;
                    return true;
                },
                content:function (){
                    target.damage(1);
                },
            },
            "蔷薇":{
                skillAnimation:true,
                unique:true,
                priority:-10,
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){
                    return player.countCards('h')==0;
                },
                content:function (){
                    player.maxHp++;
                    player.update();
                    player.recover(1);
                    player.draw(4);
                    player.addSkill('读心');
                    player.addSkill('蔷薇2');
                    player.removeSkill('蔷薇');
                },
            },
            "蔷薇2":{
                trigger:{
                    player:"turnOverEnd",
                },
                filter:function (event,player){
                    return player.countCards('h')>1;
                },
                content:function (){
                    "step 0"
                    player.chooseToDiscard(2,true,'h');
                    event.targets=game.filterPlayer();
                    event.targets.remove(player);
                    event.targets.sort(lib.sort.seat);
                    player.line(event.targets,'green');
                    "step 1"
                    if(event.targets.length){
                        event.targets.shift().damage();
                        event.redo();
                    }
                },
            },
            "天仪":{
                forced:true,
                trigger:{
                    player:"discardAfter",
                },
                filter:function (event,player){
                    if(player.storage.tian1yi2&&player.storage.tian1yi2.length >= 16)
                        return false;
                    for(var i=0;i<event.cards.length;i++){
                        if(get.position(event.cards[i])=='d'){
                            return true;
                        }
                    }
                    return false;
                },
                content:function (){
                    event.cards=trigger.cards.slice(0);
                    for(var i=0;i<event.cards.length;i++){
                        if((player.storage.tian1yi2.length < 16) && (get.position(event.cards[i]) =='d'))
                        {
                            player.storage.tian1yi2.push(event.cards[i]);
                        }
                    }
                },
                init:function (player){
                    player.storage.tian1yi2=[];
                },
            },
            "魔炮":{
                enable:"phaseUse",
                position:"h",
                usable:1,
                selectCard:2,
                filterCard:true,
                filter:function (event,player){
                    return (player.storage.tian1yi2.length >= 2);
                },
                filterTarget:function (card,player,target){
                    return (player!=target);
                },
                content:function (){
                    var Marisa_temp = 0;
                    if(player.storage.tian1yi2.length >= 2 && player.storage.tian1yi2.length <= 3)
                    {
                        Marisa_temp = 1;
                    }
                    if(player.storage.tian1yi2.length >= 4 && player.storage.tian1yi2.length <= 7)
                    {
                        Marisa_temp = 2;
                    }
                    if(player.storage.tian1yi2.length >= 8 && player.storage.tian1yi2.length <= 15)
                    {
                        Marisa_temp = 3;
                    }
                    if(player.storage.tian1yi2.length == 16)
                    {
                        Marisa_temp = 4;
                    }
                    event.targets2=game.filterPlayer();
                    event.targets2.remove(player);
                    event.targets2.remove(target);
                    if(Marisa_temp >= 1)
                        target.damage(Marisa_temp);
                    if(Math.floor(Marisa_temp/2) >= 1)
                    {
                        for(var i = 0;i < event.targets2.length;i++)
                        {
                            if(get.distance(target,event.targets2[i])<=1)
                            {
                                event.targets2[i].damage(Math.floor(Marisa_temp/2));
                            }
                        }
                    }
                },
                ai:{
                    damage:true,
                    order:8,
                    result:{
                        target:function (player,target){
                            return get.damageEffect(target,player);
                        },
                    },
                },
            },
            "彗星":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
                    if( event.player!=player && event.player.countCards('he')) 
                         return true;
                    else
                        return false;
                },
                content:function (){
                    player.gainPlayerCard(get.prompt('彗星',trigger.player),trigger.player,get.buttonValue,'he').set('logSkill',['彗星',trigger.player]);
                },
            },
            "文乐":{
                enable:"phaseUse",
                position:"h",
                usable:1,
                selectCard:2,
                filterCard:true,
                content:function (){
                    "step 0"
                    player.judge(function(card){
                        if(get.suit(card)=='diamond' && (player.hasSkill('上海') == 0)) 
                        {
                            return 4;   
                        }
                        else if(get.suit(card)=='club' && (player.hasSkill('京都') == 0)) 
                        {
                            return 3;   
                        }
                        else if(get.suit(card)=='spade' && (player.hasSkill('伦敦') == 0)) 
                        {
                            return 2;   
                        }
                        else if(get.suit(card)=='heart' && (player.hasSkill('蓬莱') == 0)) 
                        {
                            return 1;   
                        } 
                        else
                        {
                            return -1;
                        }          
                    })
                    "step 1"
                    if(result.judge==4){
                        player.addSkill('上海');
                        player.maxHp++;
                        player.update();
                    }
                    else if(result.judge==3){
                        player.addSkill('京都');
                        player.maxHp++;
                        player.update();
                    }
                    else if(result.judge==2){
                        player.addSkill('伦敦');
                        player.maxHp++;
                        player.update();
                    }
                    else if(result.judge==1){
                        player.addSkill('蓬莱');
                        player.maxHp++;
                        player.update();
                    }
                },
            },
            "上海":{
                trigger:{
                    player:["phaseBegin","phaseEnd"],
                },
                direct:true,
                content:function (){
                    "step 0"
                    var check= player.countCards('h')>2;
                    player.chooseTarget(get.prompt('上海'),function(card,player,target){
                        if(player==target) return false;
                        return player.canUse({name:'sha'},target,false);
                    }).set('check',check).set('ai',function(target){
                        if(!_status.event.check) return 0;
                        return get.effect(target,{name:'sha'},_status.event.player);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('上海',result.targets);
                        player.useCard({name:'sha'},result.targets[0],false);
                    }
                },
            },
            "京都":{
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                frequent:true,
                content:function (){
                    trigger.num += 2 ;
                },
            },
            "伦敦":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
                    if(event.source&&event.source.countCards('h') < player.countCards('h')) 
                        return true;
                    else
                        return false;
                },
                content:function (){
                    trigger.cancel();
                },
            },
            "飞刀":{
                group:["飞刀1","飞刀2"],
            },
            "飞刀1":{
                mod:{
                    targetInRange:function (card,player,target,now){
                        if(card.name=='sha') 
                            return true;
                    },
                },
                ai:{
                    unequip:true,
                },
            },
            "飞刀2":{
                trigger:{
                    player:"shaBegin",
                },
                check:function (event,player){
                    return get.attitude(player,event.target)<=0;
                },
                logTarget:"target",
                filter:function (event,player){
                    return true;
                },
                content:function (){
                    trigger.directHit=true;
                },
            },
            "幻世":{
                group:["幻世1","幻世2","幻世3"],
            },
            "幻世1":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                mark:true,
                filter:function (event){
                    return event.num>0;
                },
                init:function (player){
                    player.storage.huanshi=0;
                },
                content:function (){
                    player.storage.huanshi ++;
                },
                intro:{
                    content:"mark",
                },
            },
            "幻世2":{
                unique:true,
                enable:"phaseUse",
                filter:function (event,player){
                    return player.storage.huanshi&&player.storage.huanshi>=2;
                },
                filterTarget:function (card,player,target){
                    if(player==target)
                        return false;
                    return true;
                },
                content:function (){
                    player.storage.huanshi -= 2;
                    target.turnOver();
                },
                mark:true,
            },
            "幻世3":{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event){
                    return event.num>0 && event.player.isTurnedOver();
                },
                content:function (){
                    trigger.num ++;
                },
            },
            "六根":{
                trigger:{
                    player:["shaBefore"],
                    target:["shaBefore"],
                },
                filter:function (event,player){
                    return true;
                },
                frequent:true,
                content:function (){
                    player.draw();
                },
            },
            "业风":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                filter:function (event,player){
                    return (event.source);
                },
                content:function (){
                    player.logSkill("业风",trigger.source);
                    player.useCard({name:'sha'},trigger.source,false);
                },
            },
            "魂魄":{
                trigger:{
                    player:"respond",
                },
                filter:function (event,player){
                    return event.card.name=='shan';
                },
                direct:true,
                forced:true,
                content:function (){
                    player.recover(1);
                },
            },
            "净化":{
    			group:["净化1","净化2"],
            },
            "净化1":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event){
                    if(event.nature=='fire' || event.nature=='thunder') 
                        return true;
                    else
                        return false;
                },
                content:function (){
                    trigger.cancel();
                },
            },
            "净化2":{
    			trigger:{target:'useCardToBefore'},
    			forced:true,
    			filter:function(event,player){
    				return (get.type(event.card)=='delay');
    			},
    			content:function(){
    				trigger.cancel();
    			},
            },
            "旧史":{
				trigger:{player:'phaseDrawBefore'},
                direct:true,
                filter:function(event,player){
    				return true;
                },
                content:function(){
                    "step 0"
                    var num=game.countPlayer(function(current){
    					return true;
    				});
                    player.chooseTarget(get.prompt('旧史'),[1,num],function(card,player,target){
                        return true;
                    }).set('ai',function(target){
                        return -get.attitude(_status.event.player,target);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('旧史',result.targets);
                        event.targets=result.targets;
                        event.num=0;
                    }
                    else{
                        event.finish();
                    }
                    "step 2"
                    if(event.num<event.targets.length){
                        event.targets[event.num].link();
                        event.num++;
                        event.redo();
                    }
                    "step3"
                        trigger.cancel();
                },
                ai:{
                    expose:0.3
                }
            },
            "新史":{
                trigger:{
                    global:"damageEnd",
                },
                forced:true,
                filter:function (event){
                    if(event.nature=='fire' || event.nature=='thunder') 
                        return true;
                    else
                        return false;
                },
                content:function (){
                    player.draw(trigger.num);
                },
            },
        },
        translate:{
            "幻视":"幻视",
            "狂气":"狂气",
            "红魔":"红魔",
            "命运":"命运",
            "神枪":"神枪",
            "破碎":"破碎",
            "四重":"四重",
            "奇迹":"奇迹",
            "奇迹2":"奇迹",
            "祈愿":"祈愿",
            "风祝":"风祝",
            "蓬莱":"蓬莱",
            "天翔":"天翔",
            "天翔1":"天翔",
            "天翔2":"天翔",
            "灭罪":"灭罪",
            "神宝":"神宝",
            "神宝2":"神宝",
            "难题":"难题",
            "难题2":"难题",
            "龙玉":"龙玉",
            "龙玉2":"龙玉",
            "佛石":"佛石",
            "佛石2":"佛石",
            "火盾":"火盾",
            "火盾2":"火盾",
            "命泉":"命泉",
            "命泉2":"命泉",
            "玉枝":"玉枝",
            "玉枝2":"玉枝",
            "读心":"读心",
            "催眠":"催眠",
            "本我":"本我",
            "超我":"超我",
            "埋火":"埋火",
            "蔷薇":"蔷薇",
            "蔷薇2":"蔷薇",
            "天仪":"天仪",
            "魔炮":"魔炮",
            "彗星":"彗星",
            "文乐":"文乐",
            "上海":"上海",
            "伦敦":"伦敦",
            "京都":"京都",
            "飞刀":"飞刀",
            "飞刀1":"飞刀",
            "飞刀2":"飞刀",
            "幻世":"幻世",
            "幻世1":"幻世",
            "幻世2":"幻世",
            "幻世3":"幻世",
            "六根":"六根",
            "业风":"业风",
            "魂魄":"魂魄",
            "净化":"净化",
            "净化1":"净化",
            "净化2":"净化",
            "旧史":"旧史",
            "新史":"新史",
            "幻视_info":"幻视调律",
            "狂气_info":"狂气之瞳",
            "红魔_info":"吸血鬼幻想",
            "命运_info":"绯红的命运",
            "神枪_info":"神枪冈格尼尔",
            "破碎_info":"星弧破碎",
            "四重_info":"四重存在",
            "奇迹_info":"五谷丰登之浴",
            "祈愿_info":"忘却的祭仪",
            "风祝_info":"秘法·九字切",
            "蓬莱_info":"蓬莱人形",
            "天翔_info":"火鸟凤翼天翔",
            "灭罪_info":"灭罪寺院伤",
            "神宝_info":"辉夜的五神宝",
            "难题_info":"辉夜的五难题",
            "读心_info":"想起·恐怖的记忆",
            "催眠_info":"想起·恐怖催眠术",
            "本我_info":"本我的解放",
            "超我_info":"超我·抑制",
            "埋火_info":"恋爱的埋火",
            "蔷薇_info":"地底蔷薇",
            "天仪_info":"太阳系仪",
            "魔炮_info":"极限火花",
            "彗星_info":"爆裂彗星",
            "文乐_info":"少女文乐",
            "飞刀_info":"狂气的杰克",
            "幻世_info":"The_world",
            "六根_info":"六根清净斩",
            "业风_info":"业风闪影阵",
            "魂魄_info":"三魂七魄",
            "净化_info":"若有若无的净化",
            "旧史_info":"旧秘境史",
            "新史_info":"新幻想史",
        },
    },
    intro:"",
    author:"514DNA",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["魂魄妖梦.jpg","上白泽慧音.jpg","西行寺幽幽子.jpg"],"card":[],"skill":[]}}})