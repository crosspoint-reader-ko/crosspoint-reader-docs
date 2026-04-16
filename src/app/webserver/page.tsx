import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "웹 서버 가이드",
  description:
    "CrossPoint Reader의 내장 웹 서버를 사용하여 EPUB, XTC, XTCH 파일을 무선으로 업로드하는 방법을 안내합니다.",
  openGraph: {
    title: "웹 서버 가이드 | CrossPoint Reader",
    description:
      "CrossPoint Reader의 내장 웹 서버를 사용하여 파일을 무선으로 업로드하는 방법을 안내합니다.",
  },
};

export default function WebserverPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">웹 서버 가이드</h1>
            <p className="mt-4 text-lg text-gray-600">
              WiFi를 통해 EPUB 파일을 업로드하고 관리하는 방법을 안내합니다.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-blue max-w-none">
              {/* Overview */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">개요</h2>
                <p className="text-gray-600 mb-4">
                  CrossPoint Reader에는 내장 웹 서버가 포함되어 있어 다음 기능을
                  사용할 수 있습니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>동일한 WiFi 네트워크의 모든 기기에서 EPUB 파일 업로드</li>
                  <li>SD 카드의 파일 탐색 및 관리</li>
                  <li>전자책 정리를 위한 폴더 생성</li>
                  <li>파일 및 폴더 삭제</li>
                  <li>
                    <strong>책 직접 다운로드</strong> (v1.2.0): 웹 UI에서 SD
                    카드의 책을 브라우저로 내려받기
                  </li>
                  <li>
                    <strong>WebDAV 지원</strong> (v1.1+): macOS Finder, Windows
                    탐색기, Cyberduck 등에서 기기를 네트워크 드라이브로 마운트
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
                  필요 조건
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>CrossPoint Reader 기기</li>
                  <li>WiFi 네트워크</li>
                  <li>
                    <strong>동일한 WiFi 네트워크</strong>에 연결된 컴퓨터, 스마트폰
                    또는 태블릿
                  </li>
                </ul>
              </div>

              {/* Step 1 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  1단계: WiFi 화면 접근
                </h2>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>
                    메인 메뉴 또는 파일 브라우저에서 <strong>설정</strong> 화면으로
                    이동
                  </li>
                  <li>
                    <strong>WiFi</strong> 옵션 선택
                  </li>
                  <li>기기가 자동으로 사용 가능한 네트워크를 스캔하기 시작</li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  2단계: WiFi 연결
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  사용 가능한 네트워크 보기
                </h3>
                <p className="text-gray-600 mb-4">
                  스캔이 완료되면 다음 표시와 함께 사용 가능한 WiFi 네트워크
                  목록이 표시됩니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                  <li>
                    <strong>신호 강도 바</strong> (||||, |||, ||, |) - 연결 품질
                    표시
                  </li>
                  <li>
                    <strong>* 기호</strong> - 비밀번호로 보호됨 (암호화됨)
                  </li>
                  <li>
                    <strong>+ 기호</strong> - 이전에 저장된 자격 증명이 있음
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  네트워크 선택
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
                  <li>
                    <strong>왼쪽/오른쪽</strong> (또는 <strong>이전/다운</strong>)
                    버튼으로 네트워크 목록 탐색
                  </li>
                  <li>
                    <strong>확인</strong>을 눌러 강조된 네트워크 선택
                  </li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  비밀번호 입력
                </h3>
                <p className="text-gray-600 mb-4">
                  네트워크에 비밀번호가 필요한 경우:
                </p>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
                  <li>화면 키보드가 나타남</li>
                  <li>탐색 버튼으로 문자 선택</li>
                  <li>
                    <strong>확인</strong>으로 각 문자 입력
                  </li>
                  <li>
                    완료되면 키보드의 <strong>Done</strong> 옵션 선택
                  </li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>참고:</strong> 이전에 이 네트워크에 연결한 적이 있으면
                    저장된 비밀번호가 자동으로 사용됩니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3단계: 연결 성공
                </h2>
                <p className="text-gray-600 mb-4">
                  연결되면 화면에 다음이 표시됩니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                  <li>
                    <strong>네트워크 이름</strong> (SSID)
                  </li>
                  <li>
                    <strong>IP 주소</strong> (예: 192.168.1.102)
                  </li>
                  <li>
                    <strong>웹 서버 URL</strong> (예: http://192.168.1.102/)
                  </li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>중요:</strong> IP 주소를 기억해 두세요 - 컴퓨터나
                    스마트폰에서 웹 인터페이스에 접근할 때 필요합니다.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  4단계: 웹 인터페이스 접근
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  컴퓨터에서
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1 mb-6">
                  <li>
                    컴퓨터가 CrossPoint Reader와 <strong>동일한 WiFi 네트워크</strong>
                    에 연결되어 있는지 확인
                  </li>
                  <li>웹 브라우저 열기 (Chrome 권장)</li>
                  <li>기기에 표시된 IP 주소를 주소창에 입력</li>
                  <li>Enter 키 누르기</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  스마트폰 또는 태블릿에서
                </h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>
                    스마트폰/태블릿이 CrossPoint Reader와{" "}
                    <strong>동일한 WiFi 네트워크</strong>에 연결되어 있는지 확인
                  </li>
                  <li>모바일 브라우저 열기 (Safari, Chrome 등)</li>
                  <li>IP 주소를 주소창에 입력</li>
                  <li>이동 탭</li>
                </ol>
              </div>

              {/* Step 5 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  5단계: 웹 인터페이스 사용
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  홈페이지
                </h3>
                <p className="text-gray-600 mb-4">홈페이지에 표시되는 정보:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
                  <li>기기 상태 및 버전 정보</li>
                  <li>WiFi 연결 상태</li>
                  <li>현재 IP 주소</li>
                  <li>사용 가능한 메모리</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  파일 관리자
                </h3>
                <p className="text-gray-600 mb-4">
                  <strong>File Manager</strong>를 클릭하여 파일 관리 기능에
                  접근합니다.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      파일 탐색
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>SD 카드의 모든 파일과 폴더 표시</li>
                      <li>폴더 이름을 클릭하여 해당 폴더로 이동</li>
                      <li>상단의 경로 탐색으로 상위 폴더로 이동</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      EPUB 파일 업로드
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>
                        우측 상단의 <strong>+ Add</strong> 버튼 클릭
                      </li>
                      <li>
                        드롭다운 메뉴에서 <strong>Upload eBook</strong> 선택
                      </li>
                      <li>
                        <strong>Choose File</strong>을 클릭하고 .epub 파일 선택
                      </li>
                      <li>
                        <strong>Upload</strong> 클릭
                      </li>
                      <li>진행률 바가 업로드 상태 표시</li>
                      <li>업로드 완료 시 페이지가 자동으로 새로고침</li>
                    </ol>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-blue-800 text-sm">
                        <strong>참고:</strong> .epub 파일만 허용됩니다. 다른 파일
                        유형은 거부됩니다.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      폴더 생성
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>
                        우측 상단의 <strong>+ Add</strong> 버튼 클릭
                      </li>
                      <li>
                        드롭다운 메뉴에서 <strong>New Folder</strong> 선택
                      </li>
                      <li>폴더 이름 입력 (영문, 숫자, 밑줄, 하이픈만 사용 가능)</li>
                      <li>
                        <strong>Create Folder</strong> 클릭
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      파일 및 폴더 삭제
                    </h4>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                      <li>파일 또는 폴더 옆의 휴지통 아이콘 클릭</li>
                      <li>팝업 대화상자에서 삭제 확인</li>
                      <li>
                        <strong>Delete</strong>를 클릭하여 영구 삭제
                      </li>
                    </ol>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-red-800 text-sm">
                        <strong>경고:</strong> 삭제는 영구적이며 취소할 수 없습니다!
                        폴더는 비어 있어야 삭제할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  문제 해결
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      네트워크에서 기기가 보이지 않음
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>문제:</strong> 브라우저에서 &quot;연결할 수 없음&quot; 또는
                      &quot;사이트에 연결할 수 없음&quot; 표시
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>
                        두 기기가 <strong>동일한 WiFi 네트워크</strong>에 있는지
                        확인
                      </li>
                      <li>IP 주소가 정확히 입력되었는지 확인</li>
                      <li>
                        주소 시작에 <code className="bg-gray-100 px-1 rounded">http://</code> 포함
                      </li>
                      <li>VPN을 사용 중이라면 비활성화 시도</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      연결이 끊기거나 타임아웃
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>WiFi 라우터에 더 가까이 이동</li>
                      <li>기기의 신호 강도 확인 (|| 이상 권장)</li>
                      <li>다른 기기의 간섭 피하기</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      업로드 실패
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>파일이 유효한 .epub 파일인지 확인</li>
                      <li>SD 카드에 충분한 공간이 있는지 확인</li>
                      <li>먼저 더 작은 파일로 업로드 테스트</li>
                      <li>브라우저 페이지를 새로고침하고 다시 시도</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  보안 참고사항
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>웹 서버는 포트 80 (표준 HTTP)에서 실행</li>
                  <li>
                    <strong>인증이 필요하지 않음</strong> - 동일 네트워크의 누구나
                    인터페이스에 접근 가능
                  </li>
                  <li>
                    WiFi 화면에 &quot;Connected&quot;가 표시되는 동안만 웹 서버에 접근
                    가능
                  </li>
                  <li>WiFi 화면을 나가면 웹 서버가 자동으로 중지</li>
                  <li>보안을 위해 신뢰할 수 있는 프라이빗 네트워크에서만 사용</li>
                </ul>
              </div>

              {/* Exit */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  WiFi 모드 종료
                </h2>
                <p className="text-gray-600 mb-4">
                  파일 업로드를 완료한 후:
                </p>
                <ol className="list-decimal list-inside text-gray-600 space-y-2">
                  <li>
                    CrossPoint Reader의 <strong>뒤로</strong> 버튼 누르기
                  </li>
                  <li>웹 서버가 자동으로 중지됨</li>
                  <li>WiFi가 연결 해제되어 배터리 절약</li>
                  <li>이전 화면으로 돌아감</li>
                </ol>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 text-sm">
                    업로드한 파일은 파일 브라우저에서 바로 사용할 수 있습니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
