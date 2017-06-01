Ext.define('mhelpdesk.view.Locale', {
	singleton : true,
	config : {
		ms_MY : {
			General : {
				red : 'Merah',
				orange : 'Oren',
				yellow : 'Kuning',
				green : 'Hijau',
				blue : 'Biru',
				mainTitle : 'Sistem Meja Bantuan',
				msgNotFound : 'TIADA',
				msgFound : 'ADA',
				msgNoSubject : 'Matapelajaran yang dicari, tiada hari ini ...',
				msgTitleDelete : 'Hapus',
				msgWaitHome : 'Ke Laman Utama',
				msgWaitPage : 'Buka Laman',
				msgSendTo : 'Hantar ke ',
				msgAsk : 'Adakah anda pasti?',
				msgSuccess : "Berjaya",
				msgAlert : 'Makluman',
				msgFail : "Gagal",
				msgThanks : "Terima Kasih",
				msgAddSuccess : "Operasi yang dilakukan telah berjaya.",
				msgDelSuccess : "Operasi yang dilakukan telah berjaya.",
				msgUpdSuccess : "Operasi kemaskini yang dilakukan telah berjaya.",
				msgTransFail : "Operasi gagal dilaksanakan.",
				msgNotice : "Terima kasih diatas kesudian anda menggunakan sistem kami. <br> Borang permohonan pendaftaran anda telah diterima dan akan diproses dalam jangka masa tujuh (7) hari berkerja.<br>Sila semak emel yang didaftarkan untuk makluman balas permohonan dari kami.",
				msgNoticeFail : "Sistem mengalami masaalah teknikal. Ia mungkin disebabkan masaalah sambungan, sila cuba sekali lagi ...",
				msgNewReg : "Test",
				msgShowImage : 'Buka Gambar',
				msgSignIn : 'Daftar Masuk',
				msgSignOut : 'Daftar Keluar',
				waitProcess : 'Sedang memproses permintaan anda ...',
				waitRefresh : 'Kemaskini semula data ...',
				waitData : 'Capaian data ...',
				dateInvalid : 'Tarikh salah, Sila isi tarikh ...',
				timeInvalid : 'Masa salah, Sila isi masa ...',
				dateEmpty : 'Tarikh tidak diisi, Sila isi tarikh ...',
				fieldEmpty : 'tidak diisi. Sila isi ...',
				fieldDifferent : 'yang diisi berbeza. Sila isi Semula',
				fieldIncomplete : 'Maklumat tidak lengkap',
				Enter : 'Sila masukkan',
				Choose : 'Sila pilih',
				EnterChoose : 'Sila masukkan/pilih',
				Answered : 'Dijawab',
				NotAnswered : 'Belum Dijawab',
				Subject : 'Perkara',
				DateCreate : 'Tarikh Hantar',
				Ticket : 'Tiket',
				Message : 'Pesanan / Nota',
				Attachment : 'Lampiran'
			},
			HomePage : {
				txtScan : 'Imbas Kod QR',
				txtTraining : "Latihan / Kursus",
				txtTrainingLine : "*Menyelaras Kursus dan Latihan anjuran negeri<br>*Pembudayaan Usahawan",
				txtGroom : "Groom Big",
				txtGroomLine : "*Naiktaraf produk untuk pasaran lebih luas",
				txtOneStop : "Pusat Sehenti untuk Rujukan",
				txtOneStopLine : "*Rujukan kepada usahawan, maklumat semua agensi, skim initiatif yang ditawarkan",
				txtMarketing : "Pemasaran",
				txtMarketingLine : "*Gerak Usahawan Negeri Johor<br>*Star Rating Usahawan<br>*Anugerah Usahawan Bumiputra Johor<br>*Direktori Usahawan Johor<br>*Flyers Stand - Billboard<br>*Penubuhan PUJB Retail SB<br>*Business Matching",
				txtBusiness : "Bidang Perniagaan Baru",
				txtBusinessLine : "*Perniagaan secara online<br>*Industri kosmetik dan runcit<br>*Argopreneur<br>*Pendidikan awal kanak-kanak",
				txtIndustry : "Industri Sokongan",
				txtIndustryLine : "*Industri Minyak & Gas<br>*Industri Hab Coklat<br>*Industri Kreatif<br>*Industri Perubatan",
				txtWelcome : "Selamat Datang ke Sistem Meja Bantuan WtDesk",
				txtIntro : "WtDesk adalah mudah dan mesra pengguna untuk digunakan bagi penyelesaian meja bantuan yang menawarkan perkhidmatan dalam talian "
				+ "secara langsung dan pemantauan sepanjang masa yang tersedia untuk peranti mudah alih dan Web.<br>"
				+ "Berdasarkan pengalaman kami melaksanakan projek berskala besar, Meja Bantuan yang cekap dan berkesan menyumbang dengan ketara kepada kejayaan"
				+ "projek IT, lebih-lebih lagi untuk salah satu yang dilaksanakan di peringkat nasional atau antarabangsa. Ini kerana pihak berkepentingan yang "
				+ "sangat penting dalam projek itu, iaitu Pengguna, dipastikan bahawa mereka mempunyai akses kepada perkhidmatan sokongan profesional selain dari"
				+ "hanya membuat panggilan telefon cepat atau menghantar e-mel ke destinasi yang dikenali dan membantu.<br>"
				+ "Satu tiket permasalahan akan dinaikkan bagi setiap masalah yang dilaporkan kepada WtDesk, dan tiket itu kemudian dikesan sehingga masalah "
				+ "itu diselesaikan sepenuhnya. Sekiranya kakitangan Meja Bantuan mengambil yang mengambil panggilan tidak boleh menyelesaikan masalah ini, "
				+ "masalah ini akan dibawa ke peringkat kedua Meja Bantuan WtDesk untuk penyelesaian berikutnya, diikuti oleh tahap Sokongan pasukan ketiga "
				+ "jika perlu, sehingga isu-isu diselesaikan.",
				txtFeatures : "Fungsi",
				txtColumn1 : "*Pelbagai Antara Muka Pengguna<br>Aplikasi Web (Browser-Based)<br>*Akses Melalui Media Sesawan Web<br>*Akses melalui peranti mudah alih"
				+ "*Aplikasi Telefon Bimbit<br>*Sokongan peranti tambahan - ini termasuk sokongan untuk Pembaca Kad magnet, Peranti NFC, Barcode Pengimbas, peranti RFID dan lain-lain",
				txtColumn2 : "*Mengenalpasti dan dikendalikan oleh kakitangan terlatih dan mahir untuk membantu masalah pokok pengguna<br>*Mudah atau berulang.<br>"
				+ "*Pembaikan dari masa ke masa, dengan kemahiran menentukan permasalahan dengan lebih baik dan berpengalaman, kebanyakan panggilan diterima oleh meja "
				+ "bantuan boleh diselesaikan semasa panggilan. Ini pasti akan menyumbang ke arah mengurangkan permasalahan dengan lebih ketara.<br>*Fungsi Log Masuk atau Pendaftaran Pengguna",
				txtColumn3 : "*Mengumpul maklumat untuk tujuan rujukan<br>*Mendaftarkan setiap panggilan bantuan<br>*Memantau semua panggilan pelanggan yang belum diselesai<br>"
				+ "*Semakan semula, pencapaian data, percetakan dan penyatuan semua panggilan untuk data ekpot<br>*Boleh direka-bentuk mengikut kesesuaian pengguna"
			},
			MainPage : {
				txtHome : "Utama",
				txtTimetable : "Jadual",
				txtConfig : "Konfigurasi",
				txtSetting : "Konfigurasi",
				txtHome : "Utama",
			    txtTicket : "Tiket",
			    txtStatus : "Status",
			    txtSearch : "Carian",
			    txtFaq : "FAQ"
			},
			SystemConfig : {
				txtHeader : 'Tutup Panel Atas',
				txtEmail : 'Emel',
				txtEmailDesc : 'Masukan emel',
				txtPhone : 'Telefon',
				txtPhoneDesc : 'Masukan telefon',
				txtTitle : 'Nama Aplikasi',
				txtTitleDesc : 'Masukan Nama Aplikasi',
				txtMember : 'Ahli',
				txtMemberDesc : 'Masukan Ahli Kumpulan',
				txtLanguage : 'Bahasa',
				txtLanguageDesc : 'Pilihan Bahasa',
				txtTickerInterval : 'Kelipan Skrin',
				txtTickerIntervalDesc : 'dalam unit ms',
				txtUseSound : 'Bunyi',
				txtUseSoundDesc : 'Pilihan Bunyi',
				txtNotice : 'Keterangan Aplikasi',
				txtNoticeDesc : 'Maklumat Aplikasi',
				txtColorTrue : "Warna Betul",
				txtColorFalse : 'Warna Salah',
				txtSave : "Kemaskini",
				txtCancel : "Batal",
				txtRed : 'Merah',
				txtYellow : 'Kuning',
				txtOrange : 'Oren',
				txtGreen : 'Hijau',
				txtBlue : 'Biru',
				txtTheme : 'Tema',
				txtBM : 'Bahasa Malaysia',
				txtEN : 'English',
				txtJohorTheme : 'Tema Johor',
				txtDefaultTheme : 'Tema Asal'
			},
			Timetable : {
				txtDate : 'Tarikh'
			},
			TimetableNew : {
				txtDescription : 'Keterangan',
				txtDescriptionDesc : 'Masuk keterangan berkenaan matapelajaran',
				txtDuration : 'Jumlah Jam',
				txtDurationDesc : 'Masukan jumlah jam',
				txtDate : "Tarikh",
				txtDateDesc : 'Pilih tarikh',
				txtTimeStart : "Masa Mula",
				txtTimeEnd : "Masa Tamat",
				txtTimeStartDesc : "0:00",
				txtTimeEndDesc : "0:00",
				txtFieldsetSubject : 'Maklumat Matapelajaran',
				txtFieldsetTimetable : 'Maklumat Tarikh/Masa',
				txtSubject : 'Matapelajaran',
				txtSubjectDesc : 'Masukan matapelajaran',
				txtSubjectCode : 'Kod QR',
				txtSubjectCodeDesc : 'Masukkan kod QR',
				txtScan : 'Imbas',
				txtSave : "Simpan",
				txtDelete : "Hapus",
				txtCancel : "Batal"
			},
			MenuHome : {
				txtMain : "Utama",
				txtReturn : "Kembali",
				txtSetup : "Konfigurasi Aplikasi",
				txtTimetable : "Selenggara Jadual",
				txtUpload : "Tukar Gambar Paparan"
			},
			FileUpload : {
				txtReset : 'Asal',
				txtSet : 'Set',
				txtGetPicture : 'Ambil Gambar'

			},
			Faq : {
				txtDesc: 'Soalan-Soalan Lazim'
			},
			Search : {
				txtDesc : "Sila masukan kriteria carian dibawah dan tekan butang <b>Cari</b>",
				txtSubmit : "Cari",
				txtCompany : "Syarikat",
				txtCompanyDesc : "Masukan nama syarikat",
				txtProduct : "Produk",
				txtProductDesc : "Masukan nama produk",
				txtSearchField : "Masukan kriteria carian yang berkenaan"
			},
			Status : {
				txtTitle : 'Butir-Butir',
				txtDesc : "Untuk menyemak status Pesanan Bantuan anda, masukan maklumat Emel dan id Tiket yang berkaitan dengan Pesanan Bantuan tersebut. Jika ini adalah pemohonan pertama anda atau anda kehilangan id Tiket, Sila pilih butang <b>Tiket</b> untuk membuka permohonan tiket baru.",
				txtView : "Semak",
				txtCreate : "Tiket",
				txtEmail : "Emel",
				txtEmailDesc : "Masukan emel anda",
				txtTicket : "Tiket",
				txtTicketDesc : "Masukan no tiket anda"
			},
			Ticket : {
				txtTitle : "Isi Borang",
				txtDesc : "Sila lengkapkan maklumat seperti diruangan bawah agar kami dapat membantu anda sebaik mungkin.",
				txtSubmit : "Hantar",
				txtName : "Nama Penuh",
				txtNameDesc : "Masukan nama penuh anda",
				txtEmail : "Emel",
				txtEmailDesc : "Masukan emel anda",
				txtTel : "No. Telefon",
				txtTelDesc : "Masukan no telefon anda",
				txtBusiness : "Kategori",
				txtBusinessDesc : "Masukan kategori bantuan",
				txtSubject : "Tajuk/Subjek/Model/No Siri Perkakasan",
				txtSubjectDesc : "Masukan perkara yang berkaitan",
				txtMsg : "Permasalahan/Pertanyaan/Isu/Laporan",
				txtMsgDesc : "Masukan pesana/pertanyaan yang hendak diajukan",
				txtPriority : "Keutamaan",
				txtPriorityDesc : "Pilih tahap keutamaan pesanan",
				txtCaptcha : "Teks Captcha",
				txtCaptchaDesc : 'Masukan Teks image',
				txtAttachment : 'Pilih Fail Lampiran',
				txtUpload : 'Tukar Fail Lampiran'
			},
			PostMessage : {
				txtTitle : 'PesPermasalahan /ta Jawapan',
				txtDesc : 'Masukan pesanan / nota jawapan',
				txtPost : 'Hantar',
				txtCancel : 'Batal',
				txtAttachment : 'Lampiran',
				txtUpload : 'Tukar Lampiran'
			},
			ViewTicket : {
				txtDesc : 'Tiket #',
				txtCreated : 'Tarikh',
				txtName : 'Nama',
				txtEmail : 'Email',
				txtPhone : 'Telefon',
				txtDept : 'Jabatan',
				txtSubject : 'Pesanan / Perkara',
				txtPost : 'Jawapan',
				txtUp : 'Singkat',
				txtDown : 'Papar'
			},
			UserTicket : {
				txtView: 'Buka Tiket'
			},
			NoticeTicketFail : {
				txtDesc : 'Tiket Permohonan Bantuan GAGAL diwujudkan'
			},
			NoticeTicket : {
				txtDesc : 'Tiket Permohonan Bantuan BERJAYA diwujudkan.',
				txtPara1 : 'Terima kasih kerana telah menghubungi kami',
				txtPara2 : 'Tiket Permohonan Bantuan',
				txtPara3 : 'telah diwujudkan dan wakil kami akan menghubungi tuan dalam masa terdekat.</p>',
				txtPara4 : 'Kami juga telah emel ke <b><a href="mailto://',
				txtPara5 : 'nombor rujukan Tiket Permohonan Bantuan',
				txtPara6 : 'Nombor rujukan Tiket Permohonan Bantuan ini dan alamat emel tuan adalah diperlukan untuk tuan menyemak status dan kemajuan permohonan tuan.',
				txtPara7 : 'Sila ikut arahan di emel tersebut sekiranya tuan ingin menambah maklumat atau komen mengenai isu yang sama.',
				txtThanks : 'Terima Kasih',
				txtHelpdesk : 'Meja Bantuan WtDesk'
			}
		},
		en : {
			General : {
				red : 'Red',
				orange : 'Orange',
				yellow : 'Yellow',
				green : 'Green',
				blue : 'Blue',
				mainTitle : 'Mobile Helpdesk',
				msgNotFound : 'SORRY, NOT FOUND',
				msgFound : 'YES, FOUND',
				msgNoSubject : 'The search subject is not available today ...',
				msgTitleDelete : 'Delete',
				msgWaitHome : 'Set to Home',
				msgWaitPage : 'Load Page',
				msgSendTo : 'Send to ',
				msgAsk : 'Are you sure?',
				msgSuccess : "Success",
				msgAlert : 'Notification',
				msgFail : "Fail",
				msgThanks : "Thank You",
				msgAddSuccess : "Operation successful.",
				msgDelSuccess : "Operation successful.",
				msgUpdSuccess : "Operation successful.",
				msgTransFail : "Operation fail.",
				msgNotice : "Thank You for your registration. <br> Your registration form will be process within (7) working days.<br> Please check your email again for the approval status from our administrator.",
				msgNoticeFail : "System having some problem right now. It might cause by communication failure, please try again ...",
				msgNewReg : "Test",
				msgShowImage : 'Show Image',
				msgSignIn : 'Sign In',
				msgSignOut : 'Sign Out',
				waitProcess : 'Processing your request ...',
				waitRefresh : 'Refresh data ...',
				waitData : 'Loading data ...',
				dateInvalid : 'Invalid Date, Please enter valid date ...',
				timeInvalid : 'Inavlid Time, Please enter valide time ...',
				dateEmpty : 'Date Empty, Please enter date ...',
				fieldEmpty : 'is empty. Please fill...',
				fieldDifferent : 'value is different...',
				fieldIncomplete : 'Information Incomplete',
				Enter : 'Enter',
				Choose : 'Choose',
				EnterChoose : 'Enter/Choose',
				Answered : 'Answered',
				NotAnswered : 'Not Answered',
				Subject : 'Subject',
				DateCreate : 'Create Date',
				Ticket : 'Ticket',
				Message : 'Enquiry / Note',
				Attachment : 'Attachment'
			},
			HomePage : {
				txtScan : 'Scan Code QR',
				txtTraining : "Training / Courses",
				txtTrainingLine : "*Coordinate and training courses organized by state<br>*Entrepreneurial Culture",
				txtGroom : "Groom Big",
				txtGroomLine : "*Upgrading the product to a wider market",
				txtOneStop : "One-Stop Center for Reference",
				txtOneStopLine : "*Reference to entrepreneurs, information on related agencies, the offered initiative schemes",
				txtMarketing : "Marketing",
				txtMarketingLine : "*Johor Entrepreneurs Movement<br>*Entrepreneurs Star Rating<br>*Johor Bumiputera Entreprenenuer Award<br>*Johor Entrepreneur Directory<br>*Flyers Stand - Billboard Reviews<br>*Establishment PUJB Retail SB<br>*Business Matching",
				txtBusiness : "New Business Areas",
				txtBusinessLine : "*Online Business<br>*Cosmetic and retail industry<br>*Argopreneur<br>*Children early education",
				txtIndustry : "Support Industry",
				txtIndustryLine : "*Oil & Gas Industry<br>*Hub Industry Chocolate<br>*Creative Industry<br>*Medical Industry",
				txtWelcome : "Welcome to WtDesk-Support Center",
				txtIntro : "WtDesk is an user friendly, easy to use HelpDesk solution that offers direct online submission of require support within your "
				+ "database and real-time monitoring is make available to mobile devices and Web.<br>"
				+ "Based on our experience of implementing large scale projects, an effective and efficient Helpdesk contributes significantly to the success "
				+ "of an IT project, more so for one that is implemented on a national or international basis. This is because a very important stakeholder of "
				+ "the project, i.e. the Users, are ensured that they have access to professional support services besides just making a quick telephone call "
				+ "or sending email to a known and helpful destination.<br>"
				+ "A problem ticket will be raised for each problem reported to WtDesk Helpdesk, and the problem ticket is then tracked until the problem is "
				+ "fully resolved. In the event that WtDesk Helpdesk personnel taking the call cannot resolve the problem, the problem will be escalated to the "
				+ "second level Project Helpdesk for resolution, followed by the third level Support Team if necessary, until the issues solved.",
				txtFeatures : "Features",
				txtColumn1 : "*Multiple User Interfaces<br>*PC Client Applications (via web)<br>*Web Client Access<br>*Mobile Client Access<br>*Mobile Application<br>"
				+ "*External device support – this includes support for Magnetic Card Readers, NFC Devices, Barcode Scanners, some RFID devices and more",
				txtColumn2 : "*To identify and manned trained and skilled personnel to help user trouble-shoot problems<br>*Simple or recurring.<br>"
				+ "*Over time, with improved trouble-shooting skills and experience, most of the calls receive by the Helpdesk could be resolved during "
				+ "that call itself. This will definitely contribute towards reducing the system downtime substantially.<br>*User Log-in or Sign-up Required",
				txtColumn3 : "*Collect digital image for reference purpose<br>*Register the support calls<br>*Monitor all pending calls by client<br>"
				+ "*Retrieving, querying, manage the printing and consolidating all calls by export data<br>*3rd party add-on and can be customisable"
				
			},
			MainPage : {
				txtHome : "Main",
				txtTimetable : "Timetable",
				txtConfig : "Setting",
				txtSetting : "Setting",
				txtHome : "Home",
			    txtTicket : "Ticket",
			    txtStatus : "Status",
			    txtSearch : "Search",
			    txtFaq : "FAQ"
			},
			SystemConfig : {
				txtHeader : 'Hide Top Panel',
				txtEmail : 'Email',
				txtEmailDesc : 'Enter email',
				txtPhone : 'Phone',
				txtPhoneDesc : 'Enter phone',
				txtTitle : 'Application Name',
				txtTitleDesc : 'Enter application name',
				txtMember : 'Members',
				txtMemberDesc : 'Enter group members',
				txtLanguage : 'Language',
				txtLanguageDesc : 'Choose language',
				txtTickerInterval : 'Blink Interval',
				txtTickerIntervalDesc : 'in second',
				txtUseSound : 'Sound',
				txtUseSoundDesc : 'On/Off sound',
				txtNotice : 'Application Description',
				txtNoticeDesc : 'Enter application description',
				txtColorTrue : "Correct Color",
				txtColorFalse : 'Wrong Color',
				txtSave : "Update",
				txtCancel : "Cancel",
				txtRed : 'Red',
				txtYellow : 'Yellow',
				txtOrange : 'Orange',
				txtGreen : 'Green',
				txtBlue : 'Blue',
				txtTheme : 'Theme',
				txtBM : 'Bahasa Malaysia',
				txtEN : 'English',
				txtJohorTheme : 'Tema Johor',
				txtDefaultTheme : 'Tema Asal'
			},
			Timetable : {
				txtDate : 'Date'
			},
			TimetableNew : {
				txtDescription : 'Description',
				txtDescriptionDesc : 'Detail description on the subject',
				txtDuration : 'Total Hours',
				txtDurationDesc : 'Enter total hours',
				txtDate : "Date",
				txtDateDesc : 'Choose date',
				txtTimeStart : "Start Time",
				txtTimeEnd : "End Time",
				txtTimeStartDesc : "0:00",
				txtTimeEndDesc : "0:00",
				txtFieldsetSubject : 'Subject Description',
				txtFieldsetTimetable : 'Date/Time Description',
				txtSubject : 'Subject',
				txtSubjectDesc : 'Enter subject',
				txtSubjectCode : 'Code QR',
				txtSubjectCodeDesc : 'Enter code QR',
				txtScan : 'Scan',
				txtSave : "Save",
				txtDelete : "Delete",
				txtCancel : "Cancel"
			},
			MenuHome : {
				txtMain : "Main Page",
				txtReturn : "Return",
				txtSetup : "System Setup",
				txtTimetable : "Maintain Timetable",
				txtUpload : "Change Background Picture"
			},
			FileUpload : {
				txtReset : 'Reset',
				txtSet : 'Set',
				txtGetPicture : 'Take Picture'

			},
			Faq : {
				txtDesc: 'Frequently Asked Questions'
			},
			Search : {
				txtDesc : "Please input search information is below and click button Submit.",
				txtSubmit : "Search",
				txtCompany : "Company Name",
				txtCompanyDesc : "Enter company name",
				txtProduct : "Product",
				txtProductDesc : "Enter product",
				txtSearchField : "Enter search criteria"
			},
			Status : {
				txtTitle : 'Particulars',
				txtDesc : "To view the status of a ticket, provide us with your login data below. If this is your first time contacting us or you've lost the ticket ID, please click button <b>Create</b> to open a new ticket.",
				txtView : "Check",
				txtCreate : "Create",
				txtEmail : "Email",
				txtEmailDesc : "Enter valid email",
				txtTicket : "Ticket",
				txtTicketDesc : "Enter valid ticket"
			},
			Ticket : {
				txtTitle : "Fill Form",
				txtDesc : "Please complete the fields below as detailed as possible for your queries, <br>so we can help you as best as possible.",
				txtSubmit : "Submit",
				txtName : "Full Name",
				txtNameDesc : "Enter Full Name",
				txtEmail : "Email",
				txtEmailDesc : "Enter valid email",
				txtTel : "Telephone",
				txtTelDesc : "Enter telephone number",
				txtBusiness : "Category",
				txtBusinessDesc : "Choose category",
				txtSubject : "Title/Subject/Model/Part No",
				txtSubjectDesc : "Enter related matters",
				txtMsg : "Enquiry/Question/Complaint/Report",
				txtMsgDesc : "Enter related issue",
				txtPriority : "Priority",
				txtPriorityDesc : "Choose priority",
				txtCaptcha : "Captcha",
				txtCaptchaDesc : 'Enter image text',
				txtAttachment : 'Attach File',
				txtUpload : 'Change File'
			},
			PostMessage : {
				txtTitle : 'Message / Post Note',
				txtDesc : 'Enter your message / post note',
				txtPost : 'Submit',
				txtCancel : 'Cancel',
				txtAttachment : 'Attach File',
				txtUpload : 'Change File'
			},
			ViewTicket : {
				txtDesc : 'Ticket #',
				txtCreated : 'Created on',
				txtName : 'Name',
				txtEmail : 'Email',
				txtPhone : 'Phone',
				txtDept : 'Department',
				txtSubject : 'Subject',
				txtPost : 'Post Reply',
				txtUp : 'Hide',
				txtDown : 'Show'
			},
			UserTicket : {
				txtView: 'View Ticket'
			},
			NoticeTicketFail : {
				txtDesc : 'Requested Ticket Fail to Generate'
			},
			NoticeTicket : {
				txtDesc : 'Help Ticket Application SUCCESSFUL created.',
				txtPara1 : 'Thank you for contacting us',
				txtPara2 : 'Help Ticket Application',
				txtPara3 : 'has been established and our representatives will contact you in the near future.</p>',
				txtPara4 : 'We also have e-mail to <b><a href="mailto://',
				txtPara5 : 'Ticket Application reference number',
				txtPara6 : 'Ticket Application reference number and your email address is required to check the status and progress of your application.',
				txtPara7 : 'Please follow the instructions in the e-mail if you would like to add or comment on the same issue.',
				txtThanks : 'Thank You',
				txtHelpdesk : 'WtDesk Support'
			}
			
		}
	},
	localize : function(locale) {
		var me = this;
		try {
			if (!locale) {
				locale = 'en';
			}

			console.info('APPLY LOCALE:' + locale);
			var translations = this.config[locale];

			// me.fireEvent('localize', me, translations);
			// console.error(translations);

			for (var view in translations) {
				// console.error(view);
				if (view) {

					if (mhelpdesk.view[view]) {
						// console.warn(mhelpdesk.view[view]);
						Ext.apply(mhelpdesk.view[view].prototype,
								translations[view]);
					}
					if (mhelpdesk.component[view]) {
						Ext.apply(mhelpdesk.component[view].prototype,
								translations[view]);
					}
				}
			}
		} catch (ex) {
			console.error(ex);
		}
	},
	getSuccessText : function() {
		var system = mhelpdesk.view.System;
		var systemLocale = system.getLanguage();
		if (!systemLocale) {
			systemLocale = 'en'
		}
		var translations = this.config[systemLocale];
		var commonText = translations['General'];
		if (commonText['msgSuccess']) {
			return commonText['msgSuccess'];
		} else {
			return 'Berjaya';
		}
	},
	getFailText : function() {
		var system = mhelpdesk.view.System;
		var systemLocale = system.getLanguage();
		if (!systemLocale) {
			systemLocale = 'en'
		}
		var translations = this.config[systemLocale];
		var commonText = translations['General'];
		if (commonText['msgFail']) {
			return commonText['msgFail'];
		} else {
			return 'Gagal';
		}
	},
	getAlertText : function() {
		var system = mhelpdesk.view.System;
		var systemLocale = system.getLanguage();
		if (!systemLocale) {
			systemLocale = 'en'
		}
		var translations = this.config[systemLocale];
		var commonText = translations['General'];
		if (commonText['msgAlert']) {
			return commonText['msgAlert'];
		} else {
			return 'Makluman';
		}
	},
	getText : function(field, locale) {
		try {
			var system = mhelpdesk.view.System;
			var systemLocale = system.getLanguage();
			if (!systemLocale) {
				systemLocale = 'en'
			}
			var translations = this.config[systemLocale];
			if (locale) {
				translations = this.config[locale];
			}
			var commonText = translations['General'];
			if (commonText[field]) {
				return commonText[field];
			} else {
				return field;
			}
		} catch (ex) {
			return field;
		}
	}
});