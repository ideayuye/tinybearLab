
#include <string>
#include <node.h>

namespace hello{
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::String;
    using v8::Object;
    using v8::Value;

    void SayHello(const FunctionCallbackInfo<Value>& args){
        Isolate* isolate = args.GetIsolate();
        String::Utf8Value para0(args[0]->ToString());
        char* p1 = *para0;
        strcat(p1 , " world");
        Local<String> hello = String::NewFromUtf8(isolate,p1 );
        args.GetReturnValue().Set(hello);
    }

    void init(Local<Object> exports){
        NODE_SET_METHOD(exports,"hello",SayHello);
    }

    NODE_MODULE(addon,init);
}

