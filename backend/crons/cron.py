# from django_cron import CronJobBase, Schedule
# from academic.models import Enrollment, AcademicYear
# from datetime import datetime
# import calendar
#
# from fee.models import Fee
#
#
# class GenerateMonthlyFees(CronJobBase):
# 	RUN_AT_TIMES = ['00:00']
#
# 	# Run at midnight on the 1st of each month
# 	schedule = Schedule(run_at_times=RUN_AT_TIMES, day_of_month='1')
# 	code = 'sikshyalaya.generate_monthly_fees'
#
# 	def do(self):
# 		today = datetime.today()
# 		current_month = calendar.month_name[today.month].upper()
#
# 		current_year = AcademicYear.objects.filter(is_current=True).first()
# 		if not current_year:
# 			return
#
# 		enrollments = Enrollment.objects.all()
#
# 		for each in enrollments:
# 			already_exists = Fee.objects.filter(
# 				student=each.student,
# 				month=current_month
# 			).exists()
#
# 			if not already_exists:
# 				Fee.objects.create(
# 					student=each.student,
# 					month=current_month,
# 					amount=each.school_class.fee,
# 					status=False
# 				)
