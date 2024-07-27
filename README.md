# react-native-template-thunk-paper


# Bắt đầu bằng cách
> Clone project về

> Đặt logo.png vào thư mục src/assets/images

> Tạo logo và splash screen
```
yarn react-native generate-logo ./src/assets/images/logo.png
```
> Đổi tên project với [react-native-rename](https://github.com/junedomingo/react-native-rename)
```
npx react-native-rename@latest "new_name" -b "bundle_identifier"
```


# Figma
Ném figma này cho design để họ có thể hiểu ta có gì hơn
[Figma -Material 3 Design Kit](https://www.figma.com/design/JGrJ4fCiGC28BjQ8g4dvaL/Material-3-Design-Kit-(Community)?node-id=54795-25395&t=Caw0ISAIMApSLNaM-1)

# Cấu trúc thư mục

* scripts: Các script hỗ trợ tác vụ như log, đổi tên dự án, tạo logo, v.v...
* src: Mã nguồn chính
  * assets: Chứa các file tĩnh từ ảnh, video, âm thanh, lottie, v.v...
  * components: Nơi chứa các components dùng chung cho toàn bộ dự án
  * configs: Nơi cài đặt các cấu hình liên quan đến store, api, v.v...
  * constants: Chứa các hằng số, giá trị cố định phục vụ các phần nh logic, giao diện, ngôn ngữ, v.v..
  * helpers: Các hàm hỗ trợ được xây dựng và tích lũy trong quá trình phát triển
  * navigation: Nơi móc nối các màn hình
  * screens: Nơi viết các màn hình
  * store: Nơi chứa global state dự án và các hàm thunk
  * services: Các async function phụ trợ không làm việc trực tiếp vơ store như thunk function
  * models: Định nghĩa các đối tượng để... bạn biết rồi đấy


# Hướng dẫn sử dụng dành cho người lười
## Store
Dự án sử dụng kiến trúc redux-thunk để quản lý global states và làm việc với api.

Các hàm thunk cả api và reducer trực tiếp tôi đều để hậu tố là thunk, bạn có thể gọi chúng với dispatch hoặc sử dụng hook callThunk nếu muốn xử lý thêm logic

## UI
Tôi sử dụng react-native-paper để làm bộ khung components chính, bên cạnh đó tích hợp sẵn các component bên ngoài như date picker, time picker, multiple style text, secret button, v.v.. để có thể sử dụng thuận tiện nhất khay khi cần

Dự án có một vài biến hỗ trợ như các thông số của Device (loại devive, kích thước, v.v..), các hằng số cho đổ bóng, kích thước, style sẵn để sử dụng thuận tiện và nâng cao hiệu suất (có thể nó nhỏ nhưng tôi tin 1000 cái nhỏ cũng sẽ giúp cải thiện hiệu năng)

Về responsive thì tôi sử dụng các hàm tính toán để scale giao diện theo chiều dọc, chiều ngang (có thể thêm hệ số) nhằm giúp ứng dụng tương thích đa nền tảng, tôi cũng xuất các giá trị đó thành hằng số HS, VS, MHS, MVS để tránh việc tính toán nhiều, một vài hằng số khác như Fontsize sẽ thích hợp để scale text và icon

Dự án hỗ trợ theme và tôi cũng đã cài đặt sẵn việc chuyển theme bằng ```setThemeTypeThunk``` và hàm ```createStyles```, hook ```useSystemStyles``` để sử dụng theme trong style cho giao diện

## Tiện ích
### Đa ngôn ngữ
### Ghi lại hành động thao tác
#### Cài đặt
> Cài đặt Firebase với thư viện [React Native Firebase](https://rnfirebase.io)
* Tạo một project firebase
### Ghi nhận lỗi từ người dùng
### Tạo logo, splash screen
### Thay đổi tên dự án
### Log lại thay đổi các bản cập nhật
### Ghi nhận log lên railway
### Nhiều component hay ho trong quá trình mình dev đã được tổng hợp lại


# Giới thiệu các hàm hỗ trợ

## Các hooks
`src/helpers/hooks`

### useSystemTheme
Hook này dùng để lấy các thông tin quan trọng của hệ thống, cho phép nhận vào một stylesheet và trả về một stylesheet mới được áp dụng theme hiện tại  

## Các helper
#### Hiển thị snackbar
Tôi đã nghĩ đến toast, alert, tuy nhiên để đơn giản, tôi chỉ để snackbar
```tsx
import GlobalHelper from "helpers/globalHelper";
import {ESystemStatus} from "constants/system/system.constant";

GlobalHelper.showSnackBarHelper({
  content: "Hello",
  type: ESystemStatus.Warning
});
```
---
#### Hiển thị loading toàn màn hình
Tôi cung cấp một cách để hiển thị loading toàn màn hình và tùy chọn tự động tắt nếu bạn sợ một vấn đề bất kỳ khiến nó bị treo, chặn người dùng thao tác
```tsx
import GlobalHelper from "helpers/globalHelper";

//Hiển thị loading
GlobalHelper.showLoadingHelper();
//hoặc tự động ẩn và thời gian hiển thị
GlobalHelper.showLoadingHelper(true, duration);


//Ẩn loading
GlobalHelper.hideLoadingHelper();
```
