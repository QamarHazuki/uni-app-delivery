import { useMemberStore } from "@/store"

const baseURL = 
'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const httpinterceptor = {
    //拦截前触发
    invoke(options: UniApp.RequestOptions){
// 1. 非http开头需拼接
        if(!options.url.startsWith('http')){
            options.url = baseURL + options.url
        }
//2. 请求超时
        options.timeout = 10000
//3. 请求头设置
        options.header = {...options.header, 'source-client': 'miniapp'}
// 4. 添加token
        const MemberStore = useMemberStore()
        const token = MemberStore.profile?.token
        if(token){
            options.header = {...options.header, 'Authorization': `Bearer ${token}`}
        }
        console.log(options)
    }
}
uni.addInterceptor('request', httpinterceptor)
uni.addInterceptor('uploadFile', httpinterceptor)


interface Data<T>{
    code:string
    message:string
    result: T

}
export const http = <T>(options: UniApp.RequestOptions)=>{
    return new Promise<Data<T>>((resolve, reject)=>{
        uni.request({...options, 
            success:(res)=>{
                if(res.statusCode>=200 && res.statusCode<300){
                    resolve(res.data as Data<T>)
                }else if(res.statusCode===401){
                    const memberstore = useMemberStore()
                    memberstore.clearProfile()
                    uni.navigateTo({ url: '/pages/login/login' })
                    reject(res)
                }else{
                    uni.showToast({
                        icon: 'none',
                        title: (res.data as Data<T>).message || '请求失败',
                    })
                    reject(res)
                }
            }, 
            fail:(err)=>{
                uni.showToast({
                    icon: 'none',
                    title: '网络错误'})
                reject(err)}
        })
    })
}