// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUserContent, withdrawUser, checkPassword } from "../../api/user/UserApi"; // checkPassword 추가

// // EditProfilePage는 currentUser, onSave 프롭을 받습니다.
// // 이 프롭들은 App.js의 라우트 설정에서 전달될 것입니다.
// export default function EditProfilePage({ currentUser, onSave }) {
//     const [nickname, setNickname] = useState("");
//     const [introduction, setIntroduction] = useState("");
//     const [newProfileImg, setNewProfileImg] = useState(null);
//     const [previewImg, setPreviewImg] = useState("");
//     const navigate = useNavigate();

//     const [password, setPassword] = useState("");
//     const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    
//     const [showWithdrawalConfirmation, setShowWithdrawalConfirmation] = useState(false);
//     const [userContent, setUserContent] = useState({ posts: [], comments: [] });
//     const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

//     useEffect(() => {
//         if (currentUser) {
//             setNickname(currentUser.nickname);
//             setIntroduction(currentUser.introduction || "");
//             setPreviewImg(currentUser.profileImg);
//         }
//     }, [currentUser]);

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             setNewProfileImg(file);
//             setPreviewImg(URL.createObjectURL(file));
//         }
//     };

//     const handleNicknameCheck = () => {
//         alert("사용 가능한 닉네임입니다.");
//     };

//     const handlePasswordCheck = async () => {
//         setIsLoading(true);
//         try {
//             const response = await checkPassword(currentUser.id, password);
//             if (response.success) {
//                 setIsPasswordConfirmed(true);
//                 alert("비밀번호가 확인되었습니다. 이제 정보를 수정할 수 있습니다.");
//             } else {
//                 alert("비밀번호가 일치하지 않습니다.");
//             }
//         } catch (error) {
//             alert("비밀번호 확인 중 오류가 발생했습니다.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSave = () => {
//         const updatedUserInfo = {
//             ...currentUser,
//             nickname,
//             introduction,
//             profileImg: newProfileImg ? previewImg : currentUser.profileImg
//         };
//         onSave(updatedUserInfo);
//         navigate(-1); // 이전 페이지로 이동
//     };

//     const handleCancel = () => {
//         navigate(-1); // 이전 페이지로 이동
//     };

//     const handleShowWithdrawal = async () => {
//         setIsLoading(true);
//         try {
//             // API를 호출하여 게시글/댓글 데이터를 가져옵니다.
//             const content = await getUserContent(currentUser.id); // currentUser.id를 사용 (id가 없으면 다른 식별자 사용)
//             setUserContent(content);
//             setShowWithdrawalConfirmation(true);
//         } catch (error) {
//             alert("정보를 가져오는 데 실패했습니다.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleWithdrawal = async () => {
//         setIsLoading(true);
//         try {
//             // API를 호출하여 회원탈퇴 처리
//             await withdrawUser(currentUser.id);
//             alert("회원탈퇴가 처리되었습니다.");
//             // 로그아웃 처리 및 메인 페이지로 이동 등 추가 로직 필요
//             navigate("/"); 
//         } catch (error) {
//             alert("회원탈퇴에 실패했습니다.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="profile-edit-page">
//             <div className="profile-edit-container">
//                 <h2>프로필 수정</h2>

//                 <div className="password-check-section">
//                     <h4>비밀번호 확인</h4>
//                     <p>정보를 수정하려면 현재 비밀번호를 입력해주세요.</p>
//                     <div className="inputGroup">
//                         <input
//                             type="password"
//                             placeholder="현재 비밀번호"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             disabled={isPasswordConfirmed}
//                         />
//                         <button onClick={handlePasswordCheck} disabled={isPasswordConfirmed || isLoading}>
//                             {isLoading && !showWithdrawalConfirmation ? "확인 중..." : "확인"}
//                         </button>
//                     </div>
//                 </div>

//                 {isPasswordConfirmed && (
//                     <>
//                         <fieldset className="profile-edit-fieldset">
//                             <legend>수정 정보</legend>
//                             <div className="profileEditImgContainer">
//                                 <img src={previewImg} alt="프로필" className="profileEditImg" />
//                                 <label htmlFor="profileImgInput" className="profileImgEditButton">
//                                     이미지 변경
//                                 </label>
//                                 <input
//                                     id="profileImgInput"
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     style={{ display: "none" }}
//                                 />
//                             </div>
//                             <div className="inputGroup">
//                                 <label htmlFor="nicknameInput">닉네임</label>
//                                 <div className="nickname-input-group">
//                                     <input
//                                         id="nicknameInput"
//                                         type="text"
//                                         value={nickname}
//                                         onChange={(e) => setNickname(e.target.value)}
//                                     />
//                                     <button onClick={handleNicknameCheck} className="check-duplicate-btn">중복 확인</button>
//                                 </div>
//                             </div>
//                             <div className="inputGroup">
//                                 <label htmlFor="introductionInput">소개글</label>
//                                 <textarea
//                                     id="introductionInput"
//                                     value={introduction}
//                                     onChange={(e) => setIntroduction(e.target.value)}
//                                     rows="4"
//                                 />
//                             </div>
//                         </fieldset>
                        
//                         <div className="profile-edit-actions">
//                             <button onClick={handleSave} className="saveButton">저장</button>
//                             <button onClick={() => navigate(-1)} className="cancelButton">취소</button>
//                         </div>

//                         <div className="withdrawal-section">
//                             <button 
//                                 onClick={handleShowWithdrawal} 
//                                 className="withdrawal-btn" 
//                                 disabled={isLoading}
//                             >
//                                 {isLoading && showWithdrawalConfirmation ? '로딩 중...' : '회원탈퇴'}
//                             </button>
//                             {showWithdrawalConfirmation && (
//                                 <div className="withdrawal-confirmation">
//                                     <h4>회원탈퇴 확인</h4>
//                                     <p>회원탈퇴 시 아래의 모든 정보가 영구적으로 삭제되며, 복구할 수 없습니다.</p>
//                                     <div className="content-lists">
//                                         <strong>게시글: {userContent.posts.length}개</strong>
//                                         <ul>
//                                             {userContent.posts.map(post => <li key={post.id}>{post.title}</li>)}
//                                         </ul>
//                                         <strong>댓글: {userContent.comments.length}개</strong>
//                                         <ul>
//                                             {userContent.comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
//                                         </ul>
//                                     </div>
//                                     <p>정말로 탈퇴하시겠습니까? <span className="confirm-text" onClick={handleWithdrawal}>예, 탈퇴합니다.</span></p>
//                                 </div>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }
