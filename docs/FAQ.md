# FAQ

## createFactory 阶段和 createInterface 阶段的 options 是一样的吗？

是的，一般来说 createFactory 设置 options 就够用了，不排除有部分接口需要覆盖一部分 options 的情况，此时传入的 options 的 attribute 会覆盖 createFactory 里面同名的配置。

## query 参数是和 axios 那样传吗？

比如一个接口 getUsers，只需要传入 `getUsers(data)`，即可，data 中的项，首先会填入 urlTemplate 中挖的空，剩下的会根据 GET 和 POST，放入 url 或者 body 中。
