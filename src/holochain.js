import { connect } from '@holochain/hc-web-client'

const call = (functionName, params = {}) => {
    return new Promise((succ,err)=>{
        connect(process.env.NODE_ENV==="development"?{ url: "ws://0.0.0.0:8888"}:undefined).then(async ({callZome, close}) => {
            let zCall = await callZome('invaders', 'scores', functionName)(params)
            console.log('zCall')
            console.log(zCall)
            succ(
                JSON.parse(zCall)
            )
        }).catch(error=>{
            err(error)
        })
    })
}

const holochain = {
    isUserCreated : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_my_profile', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    createProfile : (name) => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('profile', {name})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    sendScore : (score,message) => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('publish_score', {score, message})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
    getAllScores : () => {
        return new Promise(async (succ,err) => {
            try{
                const res = await call('get_all_scores', {})
                succ(res)
            }catch(e){
                console.error('Holochain error ',e)
                err(e)
            }
        })
    },
}

export default holochain